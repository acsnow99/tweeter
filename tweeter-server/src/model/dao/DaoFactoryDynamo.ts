import { UserDaoDynamo } from "./UserDaoDynamo";
import { DaoFactory } from "./DaoFactory";
import { ImageDaoS3 } from "./ImageDaoS3";
import { FollowDaoDynamo } from "./FollowDaoDynamo";
import { SessionDaoDynamo } from "./SessionDaoDynamo";
import { PasswordDaoDynamo } from "./PasswordDaoDynamo";
import { StoryDaoDynamo } from "./StoryDaoDynamo";
import { FeedDaoDynamo } from "./FeedDaoDynamo";
import { SQSDao } from "./SQSDao";
import { SQSDaoAWS } from "./SQSDaoAWS";

export class DaoFactoryDynamo implements DaoFactory {
    public getUserDao() {
        return new UserDaoDynamo();
    }

    public getSessionDao() {
        return new SessionDaoDynamo();
    }

    public getPasswordDao() {
        return new PasswordDaoDynamo();
    }

    public getFollowDao() {
        return new FollowDaoDynamo();
    }

    public getImageDao() {
        return new ImageDaoS3();
    }

    public getStoryDao() {
        return new StoryDaoDynamo();
    }

    public getFeedDao() {
        return new FeedDaoDynamo();
    }

    public getSqsDao() {
        return new SQSDaoAWS();
    }
}
