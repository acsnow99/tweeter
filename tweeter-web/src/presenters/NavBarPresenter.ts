import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface NavBarView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,
    displayErrorMessage: (message: string) => void,
}

export class NavBarPresenter {
    private service: UserService;
    private view: NavBarView;

    public constructor(view: NavBarView) {
        this.service = new UserService();
        this.view = view;
    }
    
  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  };

}
