declare @QueueRowID uniqueidentifier, @QueueID smallint, @QueueType tinyint;
select top 1 @QueueRowID = tQue.RowID, @QueueID = tQue.ID, @QueueType = tQue.[Type] from [dbo].[dvsys_queue_queue] tQue with(nolock) where tQue.Name = N'MoveFilesToStorage' option (keepfixed plan);
if @QueueRowID is null
	exec dbo.dvsys_queue_addset	@QueueRowID = @QueueRowID output
								, @Name = N'MoveFilesToStorage'
								, @Type = 0									-- тип очереди	- 0 - простая очередь без учета множественности обработчиков
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
	select @QueueID, 0 as HandlerID, [FileID], null from dvsys_files 
	where OwnerCardID not in (select CardTypeID from dvsys_carddefs where IsDictionary =1)
	--------------------------------
	update	tQue
	set		tQue.LastFillEndTime = getdate()
	from	[dbo].[dvsys_queue_queue] tQue with(rowlock)
	where	tQue.RowID = @QueueRowID;
end