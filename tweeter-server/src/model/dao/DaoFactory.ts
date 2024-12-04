import { AuthDao } from "./AuthDao";
import { FeedDao } from "./FeedDao";
import { FollowDao } from "./FollowDao";
import { ImageDao } from "./ImageDao";
import { PasswordDao } from "./PasswordDao";
import { SessionDao } from "./SessionDao";
import { SQSDao } from "./SQSDao";
import { StatusDao } from "./StatusDao";
import { StoryDao } from "./StoryDao";
import { UserDao } from "./UserDao";

export interface DaoFactory {
    readonly getUserDao: () => UserDao;
    readonly getSessionDao: () => SessionDao;
    readonly getPasswordDao: () => PasswordDao;
    readonly getFollowDao: () => FollowDao;
    readonly getImageDao: () => ImageDao;
    readonly getStoryDao: () => StoryDao;
    readonly getFeedDao: () => FeedDao;
    readonly getSqsDao: () => SQSDao;
}
