import { AuthDao } from "./AuthDao";
import { UserDao } from "./UserDao";

export interface DaoFactory {
    readonly getUserDao: () => UserDao;
    readonly getAuthDao: () => AuthDao;
}
