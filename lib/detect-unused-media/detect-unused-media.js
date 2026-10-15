/**
 * Reports images that are not referenced by the current Antora content sources.
 *
 * @param {Object} options - Extension options.
 * @param {Object} [options.config] - Extension configuration.
 * @param {Array<string>} [options.config.excludeimageextension] - Extensions to ignore.
 */
module.exports.register = function ({ config = {} }) {
    const logger = this.getLogger('detect-unused-images');
    logger.info('Loaded resolved-reference image detector from %s', __filename);
    const usedImages = new Set();
    const extensionsToIgnore = new Set(
        ['.cast', ...(config.excludeimageextension || [])].map(extension =>
            (extension.startsWith('.') ? extension : '.' + extension).toLowerCase()
        )
    );

    this.once('contentClassified', ({ contentCatalog }) => {
        const originalResolve = contentCatalog.resolveResource;

        // A reference still protects an image when its partial is not included or
        // a formatting error prevents Asciidoctor from rendering the image macro.
        // Resolve literal targets in source context; attribute-based targets are
        // tracked below during normal conversion, with full include context.
        contentCatalog.getFiles()
            .filter(file => ['page', 'partial', 'nav'].includes(file.src.family) && file.contents)
            .forEach(file => {
                let inComment = false;
                for (const line of file.contents.toString().split(/\r?\n/)) {
                    if (line.trim() === '////') {
                        inComment = !inComment;
                        continue;
                    }
                    if (inComment || line.trimStart().startsWith('//')) continue;

                    for (const match of line.matchAll(/(?<![\\\w])image::?([^\[\r\n]+)\[/g)) {
                        const target = match[1].trim();
                        if (!target || target.includes('{')) continue;
                        const image = originalResolve.call(contentCatalog, target, file.src, 'image', ['image']);
                        if (image && image.pub) usedImages.add(image);
                    }
                }
            });

        // Antora resolves targets after processing attributes and includes.
        // Track the actual file to preserve component, version and module identity.
        const trackResource = function (...args) {
            const resource = originalResolve.apply(this, args);
            if (resource && resource.src.family === 'image' && resource.pub) {
                usedImages.add(resource);
            }
            return resource;
        };
        contentCatalog.resolveResource = trackResource;

        this.once('contextClosed', () => {
            if (contentCatalog.resolveResource === trackResource) {
                contentCatalog.resolveResource = originalResolve;
            }
        });
    });

    // Wait until pages and navigation have both resolved their image references.
    this.once('beforePublish', ({ contentCatalog }) => {
        const images = contentCatalog.getFiles().filter(file =>
            file.src.family === 'image' && file.out && file.pub &&
            !extensionsToIgnore.has(file.src.extname.toLowerCase())
        );
        const unusedImages = images.filter(image => !usedImages.has(image));

        unusedImages.forEach(image => {
            logger.warn('Unused image candidate: [%s] [%s] %s',
                image.src.component, image.src.version, image.src.path);
        });
        logger.info('Unused image detection: %s checked, %s referenced, %s candidates',
            images.length, images.length - unusedImages.length, unusedImages.length);

        if (unusedImages.length) {
            logger.warn('%s images are not referenced by the current content sources. Review the candidate list before deleting files.',
                unusedImages.length);
        }
    });
};
