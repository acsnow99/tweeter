import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { UserDto } from "tweeter-shared/src";
import { AuthTokenDto } from "tweeter-shared/src/model/dto/AuthTokenDto";
import { DaoFactory } from "../dao/DaoFactory";
import { UserDao } from "../dao/UserDao";
import { AuthDao } from "../dao/AuthDao";
import { ImageDao } from "../dao/ImageDao";
import { FollowDao } from "../dao/FollowDao";

export class UserService {
  private daoFactory: DaoFactory;
  private userDao: UserDao;
  private authDao: AuthDao;
  private followDao: FollowDao;
  private imageDao: ImageDao;

  constructor(daoFactory: DaoFactory) {
    this.daoFactory = daoFactory;
    this.userDao = daoFactory.getUserDao();
    this.authDao = daoFactory.getAuthDao();
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
    const authTokenResult = await this.authDao.createSession(alias, password);
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
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // check for existing user with the alias
    const existingUser = await this.userDao.getUser(alias);
    if (existingUser !== null) {
      throw new Error("[Bad Request]] alias already taken");
    }

    const imageUrl = await this.imageDao.putImage(alias, imageStringBase64);
  
    const user = new User(firstName, lastName, alias, imageUrl).dto;

    const aliasValidate = await this.authDao.createUserPassword(alias, password);
    const authTokenResult = await this.authDao.createSession(alias, password);
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
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  public async getFollowerCount(
    token: string,
    user: UserDto | null
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user?.alias ? user?.alias : '');
  };

  public async getFolloweeCount(
    token: string,
    user: UserDto | null
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user?.alias ? user?.alias : '');
  };

      
  public async getUser (
    authToken: AuthTokenDto,
    alias: string
  ): Promise<UserDto | null> {
    const isValidToken = await this.authDao.verifyToken(authToken.token);
    if (!isValidToken) {
      throw new Error("[Unauthorized] Invalid token");
    }
    const user: UserDto | null = await this.userDao.getUser(alias);
    return user;
  };

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const allFollowers = await this.followDao.getFollowers(userAlias);
    return await this.loadUserItems(allFollowers, lastItem, pageSize);
  };

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
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
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    const user = await this.getUserFromToken(token);
    this.followDao.insertFollowRelationship(
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
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    const user = await this.getUserFromToken(token);
    this.followDao.deleteFollowRelationship(user.alias, userToUnfollow.alias);

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  };

  private async getUserFromToken(token: string) {
    const isValidToken = await this.authDao.verifyToken(token);
    const alias = await this.authDao.readSession(token);
    console.log("isValid and alias from getUserFromToken", isValidToken, alias);
    if (!isValidToken || !alias) {
      throw new Error("[Unauthorized] Invalid token");
    }
    const user = await this.userDao.getUser(alias);
    if (!user) {
      throw new Error("[Server error] Could not find user");
    }
    return user;
  }
}
