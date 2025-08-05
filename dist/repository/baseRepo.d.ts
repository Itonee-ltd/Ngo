import { Model, Document, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
export type TDoc<T> = Document & T;
export type ProjectionArgs = string | Record<string, any> | undefined;
export declare class BaseRepository<T> {
    protected model: Model<T>;
    constructor(model: Model<T>);
    create(data: Partial<T>): Promise<TDoc<T>>;
    findById(id: string, projections?: ProjectionArgs): Promise<TDoc<T> | null>;
    findOne(filter: FilterQuery<T>, projections?: ProjectionArgs): Promise<TDoc<T> | null>;
    find(filter?: FilterQuery<T>, projections?: ProjectionArgs, options?: QueryOptions): Promise<TDoc<T>[]>;
    updateById(id: string, update: UpdateQuery<T>, options?: QueryOptions): Promise<TDoc<T> | null>;
    updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions): Promise<TDoc<T> | null>;
    deleteById(id: string): Promise<TDoc<T> | null>;
    deleteOne(filter: FilterQuery<T>): Promise<TDoc<T> | null>;
    count(filter?: FilterQuery<T>): Promise<number>;
    exists(filter: FilterQuery<T>): Promise<boolean>;
}
//# sourceMappingURL=baseRepo.d.ts.map