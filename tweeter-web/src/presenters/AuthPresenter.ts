import { NavigateFunction } from "react-router-dom";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";
import { AuthToken, User } from "tweeter-shared";

export interface AuthView extends View {
    navigate: NavigateFunction;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
}

export abstract class AuthPresenter<T extends AuthView> extends Presenter<T> {
    private _service: UserService;
    public isLoading = false;
    
    public constructor(view: T) {
        super(view);
        this._service = new UserService();
    }

    protected get service() {
        return this._service;
    }

    protected async updateUserNavigate(getUserInfo: () => Promise<[user: User, authToken: AuthToken]>, rememberMe: boolean, path: string) {
        const [user, authToken] = await getUserInfo();
        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.view.navigate(path);
    }
}
