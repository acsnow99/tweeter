import { AuthDaoDynamo } from "./AuthDaoDynamo";
import { UserDaoDynamo } from "./UserDaoDynamo";
import { DaoFactory } from "./DaoFactory";
import { ImageDaoS3 } from "./ImageDaoS3";
import { FollowDaoDynamo } from "./FollowDaoDynamo";
import { StatusDao } from "./StatusDao";
import { StatusDaoDynamo } from "./StatusDaoDynamo";

export class DaoFactoryDynamo implements DaoFactory {
    public getUserDao() {
        return new UserDaoDynamo();
    }

    public getAuthDao() {
        return new AuthDaoDynamo();
    }

    public getFollowDao() {
        return new FollowDaoDynamo();
    }

    public getImageDao() {
        return new ImageDaoS3();
    }

    public getStatusDao() {
        return new StatusDaoDynamo();
    }
}
