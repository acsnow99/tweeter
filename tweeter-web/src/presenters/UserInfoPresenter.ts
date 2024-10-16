import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, duration: number) => void;
    clearLastInfoMessage: () => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private service: UserService;
    public isFollower = false;
    public followeeCount = -1;
    public followerCount = -1;
    public isLoading = false;

    public constructor(view: UserInfoView) {
      super(view);
      this.service = new UserService();
    }
    
  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!);
      }
    }, 'determine follower status');
  };

  public async setNumbFollowees(
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.service.getFolloweeCount(authToken, displayedUser);
    }, 'get followees count');
  };

  public async setNumbFollowers(
    authToken: AuthToken,
    displayedUser: User
  ) {
    this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.service.getFollowerCount(authToken, displayedUser);
    }, 'get followers count');
  };

  public async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent,
  ): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      this.isLoading = true;
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.follow(
        authToken!,
        displayedUser!
      );

      this.isFollower = true;
      this.followerCount = followerCount;
      this.followeeCount = followeeCount;
    }, 
    'follow user', 
    () => {
      this.view.clearLastInfoMessage();
      this.isLoading = false;
    });
  };

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent,
  ): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      this.isLoading = true;
      this.view.displayInfoMessage(
        `Unfollowing ${displayedUser!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await this.service.unfollow(
        authToken!,
        displayedUser!
      );

      this.isFollower = false;
      this.followerCount = followerCount;
      this.followeeCount = followeeCount;
    },
    'unfollow user',
    () => {
      this.view.clearLastInfoMessage();
      this.isLoading = false;
    });
  };
}
