import { BaseRepository, TDoc } from './baseRepo';
import { IUser } from '../interface';
import { FilterQuery } from 'mongoose';
declare class UserRepository extends BaseRepository<IUser> {
    constructor();
    byQuery(filter: FilterQuery<IUser>): Promise<TDoc<IUser> | null>;
    byID(id: string): Promise<TDoc<IUser> | null>;
    update(id: string, data: Partial<IUser>): Promise<TDoc<IUser> | null>;
    all(filter?: FilterQuery<IUser>, options?: any): Promise<TDoc<IUser>[]>;
    getActiveUsers(): Promise<TDoc<IUser>[]>;
    findByEmailWithPassword(email: string): Promise<TDoc<IUser> | null>;
    findByVerificationToken(email: string, token: string): Promise<TDoc<IUser> | null>;
    findByResetToken(email: string, token: string): Promise<TDoc<IUser> | null>;
    softDelete(id: string): Promise<TDoc<IUser> | null>;
    restore(id: string): Promise<TDoc<IUser> | null>;
}
export declare const userRepo: UserRepository;
export default UserRepository;
//# sourceMappingURL=userRepo.d.ts.map