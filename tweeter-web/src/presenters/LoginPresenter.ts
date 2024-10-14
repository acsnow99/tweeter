import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
    displayErrorMessage: (message: string) => void;
    navigate: NavigateFunction;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
    public isLoading = false;
    private service: UserService;

    public constructor(view: LoginView) {
        super(view);
        this.service = new UserService();
    }
    
  public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
    this.doFailureReportingOperation(async () => {
      this.isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, 
    "log user in",
    () => {
      this.isLoading = false;
    });
  };
}
