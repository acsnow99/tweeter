import { AuthDao } from "./AuthDao";
import { FollowDao } from "./FollowDao";
import { ImageDao } from "./ImageDao";
import { StatusDao } from "./StatusDao";
import { UserDao } from "./UserDao";

export interface DaoFactory {
    readonly getUserDao: () => UserDao;
    readonly getAuthDao: () => AuthDao;
    readonly getFollowDao: () => FollowDao;
    readonly getImageDao: () => ImageDao;
    readonly getStatusDao: () => StatusDao;
}
