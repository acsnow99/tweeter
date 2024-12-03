import { StatusDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import { DaoFactory } from "../dao/DaoFactory";
import { FollowDao } from "../dao/FollowDao";
import { UserDao } from "../dao/UserDao";
import { SessionDao } from "../dao/SessionDao";
import { StoryDao } from "../dao/StoryDao";
import { FeedDao } from "../dao/FeedDao";

export class StatusService {
    private daoFactory: DaoFactory;
    private sessionDao: SessionDao;
    private storyDao: StoryDao;
    private feedDao: FeedDao;
    private followDao: FollowDao;
    private userDao: UserDao;

    public constructor(daoFactory: DaoFactory) {
        this.daoFactory = daoFactory;
        this.sessionDao = daoFactory.getSessionDao();
        this.storyDao = daoFactory.getStoryDao();
        this.feedDao = daoFactory.getFeedDao();
        this.followDao = daoFactory.getFollowDao();
        this.userDao = daoFactory.getUserDao();
    }

    public async loadMoreStoryItems(
        authToken: AuthTokenDto,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.validateToken(authToken.token);
        return await this.storyDao.getStoryPage(userAlias, lastItem, pageSize);
    };
    
    public async loadMoreFeedItems(
        authToken: AuthTokenDto,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        await this.validateToken(authToken.token);
        return await this.feedDao.getFeedPage(userAlias, lastItem, pageSize);
    };

    public async postStatus(
        authToken: AuthTokenDto,
        newStatus: StatusDto
    ): Promise<void> {
        const user = await this.getUserFromToken(authToken.token);
        await this.storyDao.createStatus(user, newStatus);
        const followers = await this.followDao.getFollowers(user.alias);
        if (followers.length > 0) {
            await this.feedDao.createFeedItems(followers.map((follower) => follower.alias), user, newStatus);
        }
    };

    private async validateToken(token: string) {
        const isValidToken = await this.sessionDao.verifyToken(token);
        if (!isValidToken) {
          throw new Error("[Unauthorized] Invalid token");
        }
    }

    private async getUserFromToken(token: string) {
        this.validateToken(token);
        const alias = await this.sessionDao.readSession(token);
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
