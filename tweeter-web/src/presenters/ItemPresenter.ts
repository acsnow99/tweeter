import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface ItemView<T> extends View {
    addItems: (items: T[]) => void;
}

export abstract class ItemPresenter<T, U extends ItemView<T>, S> extends Presenter<U> {
    reset() {
        this._hasMoreItems = true;
        this._lastItem = null;
    }
    private _hasMoreItems = true;
    private _lastItem: T | null = null;
    private _service: S;

    protected constructor(view: U) {
        super(view);
        this._service = this.createService();
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

    protected set lastItem(value: T | null) {
        this._lastItem = value;
    }

    protected get service() {
        return this._service;
    }

    protected get view() {
        return super.view as U;
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string){
        this.doFailureReportingOperation(async () => {
          const [newItems, hasMore] = await this.loadMoreItemsServiceCall(
            authToken,
            userAlias,
          );
    
          this.hasMoreItems = hasMore;
          this.lastItem = newItems[newItems.length - 1];
          this.view.addItems(newItems);
        }, this.getItemDescription());
      };

      protected abstract getItemDescription(): string;

      protected abstract loadMoreItemsServiceCall(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

    protected abstract createService(): S;
}
