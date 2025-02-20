import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
    clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<UserService, LogoutView> {
    public constructor(view: LogoutView) {
        super(view);
    }

    public async logout(authToken: AuthToken) {
        this.view.displayInfoMessage("Logging Out...", 0);

        this.doFailureReportingOperation(async () => {
            await this.service.logout(authToken);

            this.view.clearLastInfoMessage();
            this.view.clearUserInfo();
        }, "log user out");
    }

    protected createService(): UserService {
        return new UserService();
    }
}
