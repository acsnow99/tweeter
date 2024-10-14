import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./ItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected loadMoreItemsServiceCall(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load followees";
  }
}
