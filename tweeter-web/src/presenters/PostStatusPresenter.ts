import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import useToastListener from "../components/toaster/ToastListenerHook";

export interface PostStatusView {
    setPost: (post: string) => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => void
    displayErrorMessage: (message: string) => void,
    clearLastInfoMessage: () => void,
}

export class PostStatusPresenter {
    public isLoading = false;
    private statusService: StatusService;
    private view: PostStatusView;
    public post: string = "";

    public constructor(view: PostStatusView) {
        this.statusService = new StatusService();
        this.view = view;
    }

    public async submitPost(event: React.MouseEvent, authToken: AuthToken, currentUser: User) {
        event.preventDefault();
    
        try {
        this.isLoading = true;
        this.view.displayInfoMessage("Posting status...", 0);
    
        const status = new Status(this.post, currentUser!, Date.now());
    
        await this.statusService.postStatus(authToken!, status);
    
        this.view.setPost("");
        this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
        this.view.displayErrorMessage(
            `Failed to post the status because of exception: ${error}`
        );
        } finally {
        this.view.clearLastInfoMessage();
        this.isLoading = false;
        }
    };

    public clearPost(event: React.MouseEvent) {
        event.preventDefault();
        this.view.setPost("");
    };
}
