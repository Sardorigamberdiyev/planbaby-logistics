
class SourceService {
    constructor(Source) {
        this.Source = Source;
    }

    async createSource(name, categoryId) {
        const sourceId = !!categoryId ? categoryId : null;
        const newSource = {
            name,
            sourceId,
            isCategory: !categoryId
        }

        const source = new this.Source(newSource);
        return source.save();
    }
}

module.exports = SourceService;