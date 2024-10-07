import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class UserInfoPresenter {
    private view: UserInfoView;
    private service: UserService;
    public isFollower = false;
    public followeeCount = -1;
    public followerCount = -1;
    public isLoading = false;

    public constructor(view: UserInfoView) {
        this.view = view;
        this.service = new UserService();
    }
    
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.followeeCount = await this.service.getFolloweeCount(authToken, displayedUser);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.followerCount = await this.service.getFollowerCount(authToken, displayedUser);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  };

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent,
  ): Promise<void> {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.follow(
        authToken!,
        displayedUser!
      );

      this.isFollower = true;
      this.followerCount = followerCount;
      this.followeeCount = followeeCount;
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
        this.isLoading = true;
    }
  };

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.service.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.service.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent,
  ): Promise<void> {
    event.preventDefault();

    try {
      this.isLoading = true;
      this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.unfollow(
        authToken!,
        displayedUser!
      );

      this.isFollower = false;
      this.followerCount = followerCount;
      this.followeeCount = followeeCount;
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.isLoading = false;
    }
  };

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.service.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.service.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };
}
