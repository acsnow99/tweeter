import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import useToastListener from "../components/toaster/ToastListenerHook";
import { Presenter, View } from "./Presenter";
import { ProcessPresenter } from "./ProcessPresenter";

export interface PostStatusView extends View {
    setPost: (post: string) => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
    clearLastInfoMessage: () => void,
}

export class PostStatusPresenter extends ProcessPresenter<PostStatusView> {
    private _statusService: StatusService;
    public post: string = "";

    public constructor(view: PostStatusView) {
        super(view);
        this._statusService = new StatusService();
    }

    public get statusService() {
        return this._statusService;
    }

    public async submitPost(event: React.MouseEvent, authToken: AuthToken, currentUser: User) {
        event.preventDefault();

        this.doFailureReportingOperation(async () => {
            this.isLoading = true;
            this.view.displayInfoMessage("Posting status...", 0);
        
            const status = new Status(this.post, currentUser!, Date.now());
        
            await this.statusService.postStatus(authToken!, status);
        
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, 
        "post the status",
        () => {
            this.view.clearLastInfoMessage();
            this.isLoading = false;
        });
    };

    public clearPost(event: React.MouseEvent) {
        event.preventDefault();
        this.view.setPost("");
    };
}
