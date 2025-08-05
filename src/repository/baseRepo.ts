// src/repository/baseRepo.ts
import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';

export type TDoc<T> = Document & T;
export type ProjectionArgs = string | Record<string, any> | undefined;

export class BaseRepository<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(data: Partial<T>): Promise<TDoc<T>> {
        try {
            const document = new this.model(data);
            const savedDoc = await document.save();
            return savedDoc as unknown as TDoc<T>;
        } catch (error) {
            throw error;
        }
    }

    async findById(
        id: string, 
        projections?: ProjectionArgs
    ): Promise<TDoc<T> | null> {
        try {
            let query = this.model.findById(id);
            
            if (projections) {
                query = query.select(projections);
            }
            
            const result = await query.exec();
            return result as unknown as TDoc<T> | null;
        } catch (error) {
            throw error;
        }
    }

    async findOne(
        filter: FilterQuery<T>, 
        projections?: ProjectionArgs
    ): Promise<TDoc<T> | null> {
        try {
            let query = this.model.findOne(filter);
            
            if (projections) {
                query = query.select(projections);
            }
            
            const result = await query.exec();
            return result as unknown as TDoc<T> | null;
        } catch (error) {
            throw error;
        }
    }

    async find(
        filter: FilterQuery<T> = {}, 
        projections?: ProjectionArgs,
        options?: QueryOptions
    ): Promise<TDoc<T>[]> {
        try {
            let query = this.model.find(filter);
            
            if (projections) {
                query = query.select(projections);
            }
            
            if (options) {
                query = query.setOptions(options);
            }
            
            const results = await query.exec();
            return results as unknown as TDoc<T>[];
        } catch (error) {
            throw error;
        }
    }

    async updateById(
        id: string,
        update: UpdateQuery<T>,
        options: QueryOptions = { new: true }
    ): Promise<TDoc<T> | null> {
        try {
            const result = await this.model.findByIdAndUpdate(id, update, options).exec();
            return result as unknown as TDoc<T> | null;
        } catch (error) {
            throw error;
        }
    }

    async updateOne(
        filter: FilterQuery<T>,
        update: UpdateQuery<T>,
        options: QueryOptions = { new: true }
    ): Promise<TDoc<T> | null> {
        try {
            const result = await this.model.findOneAndUpdate(filter, update, options).exec();
            return result as unknown as TDoc<T> | null;
        } catch (error) {
            throw error;
        }
    }

    async deleteById(id: string): Promise<TDoc<T> | null> {
        try {
            const result = await this.model.findByIdAndDelete(id).exec();
            return result as unknown as TDoc<T> | null;
        } catch (error) {
            throw error;
        }
    }

    async deleteOne(filter: FilterQuery<T>): Promise<TDoc<T> | null> {
        try {
            const result = await this.model.findOneAndDelete(filter).exec();
            return result as unknown as TDoc<T> | null;
        } catch (error) {
            throw error;
        }
    }

    async count(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter).exec();
        } catch (error) {
            throw error;
        }
    }

    async exists(filter: FilterQuery<T>): Promise<boolean> {
        try {
            const result = await this.model.exists(filter).exec();
            return !!result;
        } catch (error) {
            throw error;
        }
    }
}