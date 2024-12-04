import { StatusDto, UserDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";
import { DaoFactory } from "../dao/DaoFactory";
import { FollowDao } from "../dao/FollowDao";
import { UserDao } from "../dao/UserDao";
import { SessionDao } from "../dao/SessionDao";
import { StoryDao } from "../dao/StoryDao";
import { FeedDao } from "../dao/FeedDao";
import { SQSDao } from "../dao/SQSDao";

export class StatusService {
    private daoFactory: DaoFactory;
    private sessionDao: SessionDao;
    private storyDao: StoryDao;
    private feedDao: FeedDao;
    private followDao: FollowDao;
    private userDao: UserDao;
    private sqsDao: SQSDao;

    public constructor(daoFactory: DaoFactory) {
        this.daoFactory = daoFactory;
        this.sessionDao = daoFactory.getSessionDao();
        this.storyDao = daoFactory.getStoryDao();
        this.feedDao = daoFactory.getFeedDao();
        this.followDao = daoFactory.getFollowDao();
        this.userDao = daoFactory.getUserDao();
        this.sqsDao = daoFactory.getSqsDao();
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
        await this.sqsDao.postStatus(newStatus);
    };

    public async postToFeed(status: StatusDto) {
        const followers: string[] = (await this.followDao.getFollowers(status.user.alias)).map((follower) => follower.alias);
        this.sqsDao.postToFeed(status, followers);
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
