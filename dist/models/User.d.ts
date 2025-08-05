import mongoose from "mongoose";
import { IUser } from "../interface";
declare const UserModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default UserModel;
//# sourceMappingURL=User.d.ts.map