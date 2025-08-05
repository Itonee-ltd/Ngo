"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            const document = new this.model(data);
            const savedDoc = await document.save();
            return savedDoc;
        }
        catch (error) {
            throw error;
        }
    }
    async findById(id, projections) {
        try {
            let query = this.model.findById(id);
            if (projections) {
                query = query.select(projections);
            }
            const result = await query.exec();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async findOne(filter, projections) {
        try {
            let query = this.model.findOne(filter);
            if (projections) {
                query = query.select(projections);
            }
            const result = await query.exec();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async find(filter = {}, projections, options) {
        try {
            let query = this.model.find(filter);
            if (projections) {
                query = query.select(projections);
            }
            if (options) {
                query = query.setOptions(options);
            }
            const results = await query.exec();
            return results;
        }
        catch (error) {
            throw error;
        }
    }
    async updateById(id, update, options = { new: true }) {
        try {
            const result = await this.model.findByIdAndUpdate(id, update, options).exec();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async updateOne(filter, update, options = { new: true }) {
        try {
            const result = await this.model.findOneAndUpdate(filter, update, options).exec();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteById(id) {
        try {
            const result = await this.model.findByIdAndDelete(id).exec();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteOne(filter) {
        try {
            const result = await this.model.findOneAndDelete(filter).exec();
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async count(filter = {}) {
        try {
            return await this.model.countDocuments(filter).exec();
        }
        catch (error) {
            throw error;
        }
    }
    async exists(filter) {
        try {
            const result = await this.model.exists(filter).exec();
            return !!result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=baseRepo.js.map