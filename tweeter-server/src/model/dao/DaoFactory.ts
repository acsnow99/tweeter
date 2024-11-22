import { AuthDao } from "./AuthDao";
import { ImageDao } from "./ImageDao";
import { UserDao } from "./UserDao";

export interface DaoFactory {
    readonly getUserDao: () => UserDao;
    readonly getAuthDao: () => AuthDao;
    readonly getImageDao: () => ImageDao;
}
