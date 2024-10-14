import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter } from "./Presenter";

export interface NavBarView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,
    displayErrorMessage: (message: string) => void,
}

export class NavBarPresenter extends Presenter<NavBarView> {
    private service: UserService;

    public constructor(view: NavBarView) {
        super(view);
        this.service = new UserService();
    }
    
  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  };

}
