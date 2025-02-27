import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
    setPostEmpty: () => void;
}
export class PostStatusPresenter extends Presenter<
    StatusService,
    PostStatusView
> {
    private _isLoading: boolean = false;

    public constructor(view: PostStatusView) {
        super(view);
    }

    public get isLoading() {
        return this._isLoading;
    }

    public async submitPost(post: string, user: User, authToken: AuthToken) {
        this.doFailureReportingOperation(
            async () => {
                this._isLoading = true;
                this.view.displayInfoMessage("Posting status...", 0);

                const status = new Status(post, user, Date.now());

                await this.service.postStatus(authToken, status);

                this.view.displayInfoMessage("Status posted!", 2000);

                this.view.setPostEmpty();
            },
            "post the status",
            () => {
                this.view.clearLastInfoMessage();
                this._isLoading = false;
            }
        );
    }

    protected createService(): StatusService {
        return new StatusService();
    }
}
