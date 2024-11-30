import { FakeData, Status, StatusDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import { AuthDao } from "../dao/AuthDao";
import { StatusDao } from "../dao/StatusDao";
import { DaoFactory } from "../dao/DaoFactory";
import { FollowDao } from "../dao/FollowDao";
import { UserDao } from "../dao/UserDao";

export class StatusService {
    private daoFactory: DaoFactory;
    private authDao: AuthDao;
    private statusDao: StatusDao;
    private followDao: FollowDao;
    private userDao: UserDao;

    public constructor(daoFactory: DaoFactory) {
        this.daoFactory = daoFactory;
        this.authDao = daoFactory.getAuthDao();
        this.statusDao = daoFactory.getStatusDao();
        this.followDao = daoFactory.getFollowDao();
        this.userDao = daoFactory.getUserDao();
    }

    public async loadMoreStoryItems(
        authToken: AuthTokenDto,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
        return [statuses.map((status) => status.dto), hasMore]
    };
    
    public async loadMoreFeedItems(
        authToken: AuthTokenDto,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
        return [statuses.map((status) => status.dto), hasMore]
    };

    public async postStatus(
        authToken: AuthTokenDto,
        newStatus: StatusDto
    ): Promise<void> {
        const user = await this.getUserFromToken(authToken.token);
        await this.statusDao.createStatus(user, newStatus);
        const followers = await this.followDao.getFollowers(user.alias);
        await this.statusDao.createFeedItems(followers.map((follower) => follower.alias), user, newStatus);
    };

    private async validateToken(token: string) {
        const isValidToken = await this.authDao.verifyToken(token);
        if (!isValidToken) {
          throw new Error("[Unauthorized] Invalid token");
        }
    }

    private async getUserFromToken(token: string) {
        this.validateToken(token);
        const alias = await this.authDao.readSession(token);
        if (!alias) {
          throw new Error("[Unauthorized] Token does not match a user");
        }
        const user = await this.userDao.getUser(alias);
        if (!user) {
        throw new Error("[Server error] Could not find user");
        }
        return user;
      }
}
