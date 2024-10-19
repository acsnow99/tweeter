import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface NavBarView extends View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void,
    clearLastInfoMessage: () => void,
    clearUserInfo: () => void,
}

export class NavBarPresenter extends Presenter<NavBarView> {
    private _service: UserService;

    public constructor(view: NavBarView) {
        super(view);
        this._service = new UserService();
    }

    public get service() {
      return this._service;
    }
    
  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    await this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  };
}
