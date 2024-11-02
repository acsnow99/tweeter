import { AuthToken, AuthTokenDto, FakeData, FollowRequest, GetFollowCountRequest, GetIsFollowerStatusRequest, GetUserRequest, LoginRequest, LogoutRequest, PagedUserItemRequest, RegisterRequest, User } from "tweeter-shared";
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
    const request: LogoutRequest = {
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp
      }
    }
    await this.serverFacade.logout(request);
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

    const request: RegisterRequest = {
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: imageStringBase64,
      imageFileExtension
    }

    return await this.serverFacade.register(request);
  };

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const request: GetIsFollowerStatusRequest = {
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp
      },
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl
      },
      selectedUser: {
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        alias: selectedUser.alias,
        imageUrl: selectedUser.imageUrl
      }
    };
    return await this.serverFacade.getIsFollowerStatus(request);
  };

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: GetFollowCountRequest = {
      token: authToken.token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl
      }
    }
    return await this.serverFacade.getFollowerCount(request);
  };

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: GetFollowCountRequest = {
      token: authToken.token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        alias: user.alias,
        imageUrl: user.imageUrl
      }
    }
    return await this.serverFacade.getFolloweeCount(request);
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
