import { AuthToken, Status, } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface StatusItemView extends View {
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
    public reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    private _hasMoreItems = true;
    private _lastItem: Status | null = null;

    public constructor(view: StatusItemView) {
        super(view);
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }
    public abstract showMoreItems(authToken: AuthToken, userAlias: string): void;
}
