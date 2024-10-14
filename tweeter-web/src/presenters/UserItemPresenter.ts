import { User } from "tweeter-shared";
import { ItemPresenter, ItemView } from "./ItemPresenter";
import { UserService } from "../model/service/UserService";

export abstract class UserItemPresenter extends ItemPresenter<User, ItemView<User>, UserService> {
    public constructor(view: ItemView<User>) {
        super(view);
    }

    protected createService(): UserService {
        return new UserService();
    }
}
