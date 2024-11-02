import { AuthToken, AuthTokenDto, FakeData, FollowRequest, GetUserRequest, LoginRequest, PagedUserItemRequest, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private serverFacade = new ServerFacade();

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    const request: LoginRequest = {
      alias,
      password
    }
    return await this.serverFacade.login(request);
  };

  public async logout(authToken: AuthToken): Promise<void> {
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
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

      
  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    const authTokenDto: AuthTokenDto = {
        token: authToken.token,
        timestamp: authToken.timestamp
    }
    const request: GetUserRequest = {
        authToken: authTokenDto,
        alias
    }
    return await this.serverFacade.getUser(request);
  };

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? { 
        firstName: lastItem.firstName,
        lastName: lastItem.lastName,
        alias: lastItem.alias,
        imageUrl: lastItem.imageUrl
      } : null
    }
    return await this.serverFacade.loadMoreFollowers(request);
  };

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias,
      pageSize,
      lastItem: lastItem ? { 
        firstName: lastItem.firstName,
        lastName: lastItem.lastName,
        alias: lastItem.alias,
        imageUrl: lastItem.imageUrl
      } : null
    }
    return await this.serverFacade.loadMoreFollowees(request);
  };

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      user: {
        firstName: userToFollow.firstName,
        lastName: userToFollow.lastName,
        alias: userToFollow.alias,
        imageUrl: userToFollow.imageUrl
      }
    }
    return this.serverFacade.follow(request);
  };

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    const request: FollowRequest = {
      token: authToken.token,
      user: {
        firstName: userToUnfollow.firstName,
        lastName: userToUnfollow.lastName,
        alias: userToUnfollow.alias,
        imageUrl: userToUnfollow.imageUrl
      }
    }
    return this.serverFacade.unfollow(request);
  };
}
