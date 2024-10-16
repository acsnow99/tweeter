import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "./Presenter";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {
}

export class LoginPresenter extends AuthPresenter<LoginView> {
    public constructor(view: LoginView) {
        super(view);
    }
    
  public async doLogin(alias: string, password: string, originalUrl: string | undefined, rememberMe: boolean) {
    this.doFailureReportingOperation(async () => {
      this.isLoading = true;

      let path = "/"
      if (!!originalUrl) {
        path = originalUrl;
      }

      await this.updateUserNavigate(async () => {
        const response = await this.service.login(alias, password);
        return response;
      }, rememberMe, path);
    }, 
    "log user in",
    () => {
      this.isLoading = false;
    });
  };
}
