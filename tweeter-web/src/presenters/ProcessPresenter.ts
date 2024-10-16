import { Presenter, View } from "./Presenter";

export abstract class ProcessPresenter<T extends View> extends Presenter<T> {
    public isLoading = false;
}
