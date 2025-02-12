import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/StatusService";

export interface PostStatusView {
    displayErrorMessage: (message: string) => void;
    displayInfoMessage: (message: string, time: number) => void;
    clearLastInfoMessage: () => void;
}

export class PostStatusPresenter {
    private statusService: StatusService;
    private view: PostStatusView;

    private _isLoading: boolean = false;

    public constructor(view: PostStatusView) {
        this.view = view;
        this.statusService = new StatusService();
    }

    public get isLoading() {
        return this._isLoading;
    }

    public async submitPost(post: string, user: User, authToken: AuthToken) {
        try {
            this._isLoading = true;
            this.view.displayInfoMessage("Posting status...", 0);

            const status = new Status(post, user, Date.now());

            await this.statusService.postStatus(authToken, status);

            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        } finally {
            this.view.clearLastInfoMessage();
            this._isLoading = false;
        }
    }
}
