import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { UserDto } from "tweeter-shared/src";
import { AuthTokenDto } from "tweeter-shared/src/model/dto/AuthTokenDto";
import { DaoFactory } from "../dao/DaoFactory";
import { UserDao } from "../dao/UserDao";
import { ImageDao } from "../dao/ImageDao";
import { FollowDao } from "../dao/FollowDao";
import { SessionDao } from "../dao/SessionDao";
import { PasswordDao } from "../dao/PasswordDao";

export class UserService {
  private daoFactory: DaoFactory;
  private userDao: UserDao;
  private sessionDao: SessionDao;
  private passwordDao: PasswordDao;
  private followDao: FollowDao;
  private imageDao: ImageDao;

  constructor(daoFactory: DaoFactory) {
    this.daoFactory = daoFactory;
    this.userDao = daoFactory.getUserDao();
    this.sessionDao = daoFactory.getSessionDao();
    this.passwordDao = daoFactory.getPasswordDao();
    this.followDao = daoFactory.getFollowDao();
    this.imageDao = daoFactory.getImageDao();
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[UserDto, string]> {
    if (alias === '') {
      throw new Error("[Bad Request] Invalid alias");
    }
    if (password === '') {
      throw new Error("[Bad Request] Invalid password");
    }
    if (!this.passwordDao.checkUserPassword(alias, password)) {
      throw new Error("[Unauthorized] Invalid alias or password");
    }
    const authTokenResult = await this.sessionDao.createSession(alias);
    const userResult = await this.userDao.getUser(alias);
    if (userResult === null || authTokenResult === null) {
      throw new Error("[Unauthorized] Invalid alias or password");
    }
    return [userResult, authTokenResult.token];
  };

  public async logout(authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // check for existing user with the alias
    const existingUser = await this.userDao.getUser(alias);
    if (existingUser !== null) {
      throw new Error("[Bad Request] alias already taken");
    }

    const imageUrl = await this.imageDao.putImage(alias, userImageBytes, imageFileExtension);
  
    const user = new User(firstName, lastName, alias, imageUrl).dto;

    const aliasValidate = await this.passwordDao.createUserPassword(alias, password);
    const authTokenResult = await this.sessionDao.createSession(alias);
    const userResult = await this.userDao.createUser(user);
    if (aliasValidate === null || authTokenResult === null || userResult === null) {
      throw new Error("[Bad Request] Invalid registration");
    }
    return [userResult, authTokenResult];
  };

  public async getIsFollowerStatus(
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.validateToken(authToken.token);
    return await this.followDao.getIsFollower(user.alias, selectedUser.alias);
  };

  public async getFollowerCount(
    token: string,
    user: UserDto | null
  ): Promise<number> {
    return await this.followDao.getFollowerCount(user?.alias ? user?.alias : '');
  };

  public async getFolloweeCount(
    token: string,
    user: UserDto | null
  ): Promise<number> {
    return await this.followDao.getFolloweeCount(user?.alias ? user?.alias : '');
  };

  private async validateToken(token: string) {
    const isValidToken = await this.sessionDao.verifyToken(token);
    if (!isValidToken) {
      throw new Error("[Unauthorized] Invalid token");
    }
  }

      
  public async getUser (
    authToken: AuthTokenDto,
    alias: string
  ): Promise<UserDto | null> {
    await this.validateToken(authToken.token);
    const user: UserDto | null = await this.userDao.getUser(alias);
    return user;
  };

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.validateToken(token);
    const allFollowers = await this.followDao.getFollowers(userAlias);
    return await this.loadUserItems(allFollowers, lastItem, pageSize);
  };

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    this.validateToken(token);
    const allFollowees = await this.followDao.getFollowees(userAlias);
    return await this.loadUserItems(allFollowees, lastItem, pageSize);
  };

  private async loadUserItems(allItems: UserDto[], lastItem: UserDto | null, pageSize: number): Promise<[UserDto[], boolean]> {
    let result: UserDto[] = [];
    let foundLastItem = false;
    let i = 0;
    let hasMore = false;
    allItems.forEach((item) => {
      if ((lastItem === null || foundLastItem) && i < pageSize) {
        result.push(item);
        i += 1;
      } else if (i >= 10) {
        hasMore = true;
      }
      if (lastItem !== null && item.alias === lastItem.alias) {
        foundLastItem = true;
      }
    })
    return [result, hasMore];
  }

  public async follow(
    token: string,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const user = await this.getUserFromToken(token);
    await this.followDao.insertFollowRelationship(
      user.alias, 
      userToFollow.alias, 
      `${user.lastName}, ${user.firstName}`, 
      `${userToFollow.lastName}, ${userToFollow.firstName}`,
      user.imageUrl,
      userToFollow.imageUrl
    );

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  };

  public async unfollow(
    token: string,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    const user = await this.getUserFromToken(token);
    await this.followDao.deleteFollowRelationship(user.alias, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  };

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
