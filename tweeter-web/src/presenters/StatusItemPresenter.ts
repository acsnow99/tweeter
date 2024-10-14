import { Status, } from "tweeter-shared";
import { ItemPresenter, ItemView } from "./ItemPresenter";
import { StatusService } from "../model/service/StatusService";

export abstract class StatusItemPresenter extends ItemPresenter<Status, ItemView<Status>, StatusService> {
    public constructor(view: ItemView<Status>) {
        super(view);
    }

    protected createService(): StatusService {
        return new StatusService();
    }
}
