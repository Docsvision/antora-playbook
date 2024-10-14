/*
	Скрипт предназначен для заполнения очереди, используемой сервисом FileService 
	для перемещения бинарников файлов между настроенными хранилищами

	Скрипт обрабатывает все файлы, чьи бинарники хранятся в интергированном хранилище
	и добавляет в очередь файлы не связанные со справочниками. Файлы справочников не рекомендуется вытеснять 
	во внешние хранилища. 

	Для работы скрипта требуется указать актуальное имя хранилища, в которое требуется переместить файлы.
*/

/*---------------------установите название хранилища---------------------*/		
declare @StorageID uniqueidentifier, @StorageName nvarchar(512);
-- чтобы посмотреть настроенные хранилища используйте запрос ниже
-- select * from [dbo].[dvsys_binary_storages]
set @StorageName = 'FilesOnDisk';
			
--- Отбираем файлы для перемещения

-- dictioanies identifiers
declare @dictionaries table (id uniqueidentifier)
-- files owned by dictioanies
declare @files table (id uniqueidentifier)
-- list of files to be moved
declare @filesToMove table (id uniqueidentifier)

declare @cmds table (id int identity, txt nvarchar(2000))
declare @i int = 1, @count int, @cmd nvarchar(2000)

insert into @dictionaries (id) select [CardTypeID] from dvsys_carddefs where (Options & 1) = 1

--используя метаданные собираем идентификаторы файлов, записанных в секциях справочников в полях типа FieldType.FileId
insert into @cmds (txt)
select 'select distinct ['+ fd.Alias + '] from [dvtable_{'+lower(cast(sd.SectionTypeID as nvarchar(36)))+'}] where isnull(['+ fd.Alias + '], ''00000000-0000-0000-0000-000000000000'') <> ''00000000-0000-0000-0000-000000000000'''
from dvsys_fielddefs fd
join dvsys_sectiondefs sd on (fd.SectionTypeID = sd.SectionTypeID)
join @dictionaries  cd on (sd.CardTypeID = cd.id)
where fd.Type = 11

select @count = @@ROWCOUNT

while @i <= @count
begin

	select @cmd = [txt] from @cmds where [id] = @i

	insert @files
	exec sp_executesql @cmd

	select @i = @i + 1
 
end

insert @files 
select tf.FileID
from dvsys_files tf
left join @files ef on (tf.FileID = ef.id)
where ef.id is null and tf.OwnerCardID in (select id from @dictionaries)

--готовим итоговый список за исключением файлов справочников.
insert into @filesToMove(id)
select /*top 50000*/ tf.FileID
from dvsys_files tf
inner join dbo.dvsys_binaries tBin with(nolock)	on tf.BinaryID = tBin.ID					
left join @files f on (tf.FileID = f.id)
where f.id is null 
	and (tBin.StorageID is null or tBin.StorageID in ('{00000000-0000-0000-0000-000000000000}', '{00000000-0000-0000-0000-000000000001}', '{00000000-0000-0000-0000-000000000002}'))

-- записываем файлы в очередь исключая файлы справочников
set nocount on;
set transaction isolation level read uncommitted;
select @StorageID = [StorageID] from [dbo].[dvsys_binary_storages] where [Name] = @StorageName and [StorageID] > '{00000000-0000-0000-0000-000000000002}';
if not @StorageID is null
begin
	----------------
	declare @QueueRowID uniqueidentifier, @AdditionalData nvarchar(40) = convert(nvarchar(40), @StorageID), @QueueID smallint, @QueueType tinyint;
	select top 1 @QueueRowID = tQue.RowID, @QueueID = tQue.ID, @QueueType = tQue.[Type] from [dbo].[dvsys_queue_queue] tQue with(nolock) where tQue.Name = N'MoveFilesToStorage' option (keepfixed plan);
	if @QueueRowID is null
		exec dbo.dvsys_queue_addset	@QueueRowID = @QueueRowID output
									, @Name = N'MoveFilesToStorage'
									, @Type = 0								-- тип очереди	- 0 - простая очередь без учета множественности обработчиков
																					--				- 1 - очередь поддерживающая обязательную асинхронную обработку объекта в очереди нескольким обработчиками(решается на уровне дублирования объектов в очереди по обработчикам на момнт вставки объектов)
																					--				- 2 - очередь поддерживающая обязательную синхронную обработку объекта в очереди нескольким обработчиками(при обработке объекта при его подверждении он переводится на следующий обработчик)
									, @WithConfirmation = 1						-- принцип подверждения объектов	- 0 - без подверждения: доверительный режим - объект после выдачи сразу считается обработанным
																					--									- 1 - с подтверждением - очередь ожидает подверждения от обработчика что объект обработан
									, @BlockTimeInMinutes = 60					-- время блокировки объекта в очереди, в минутах. По прошествии указанного интервала времени заблокированны объект становится доступным для выбора из очереди. По умолчаению 0 = бесконечность
									, @ValidTimeInMinutes = 0					-- время достоверности объекта в очереди в минутах. По прошествию данного времени объеты становятся не достоверными(не выдаются из очереди). По умолчаению 0 = бесконечность
									, @ProcessedObjectsLifeTimeInMinutes = 0;	-- время жизни обработанного объекта в очереди. По умолчаению 0 = сразу удаляется
	select top 1 @QueueRowID = tQue.RowID, @QueueID = tQue.ID, @QueueType = tQue.[Type] from [dbo].[dvsys_queue_queue] tQue with(nolock) where tQue.Name = N'MoveFilesToStorage' option (keepfixed plan);
	if not @QueueRowID is null
	begin
		update tQue
		set tQue.LastFillStartTime = getdate()
		from [dbo].[dvsys_queue_queue] tQue with(rowlock)
		where tQue.RowID = @QueueRowID and (tQue.LastFillStartTime < getdate() or tQue.LastFillStartTime is null);
		--------------------------------------------------------------------
		insert into [dbo].[dvsys_queue_object] with(rowlock) (QueueID, HandlerID, ObjectID, AdditionalData)
		select	@QueueID, 0 as HandlerID, tFl.id, @AdditionalData
		from	@filesToMove tFl 
				
				left outer join [dbo].[dvsys_queue_object] tQueObj with(nolock)
					on tFl.id = tQueObj.ObjectID
					and tQueObj.QueueID = @QueueID
		where	tQueObj.QueueID is null;
		--------------------------------
		update	tQue
		set		tQue.LastFillEndTime = getdate()
		from	[dbo].[dvsys_queue_queue] tQue with(rowlock)
		where	tQue.RowID = @QueueRowID;
	end
end
else 
	raiserror('Отсутствует указанное хранилище', 17, 1);
