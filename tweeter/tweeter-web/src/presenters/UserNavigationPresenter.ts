import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<
    UserService,
    UserNavigationView
> {
    public constructor(view: UserNavigationView) {
        super(view);
    }

    public async navigateToUser(
        target: string,
        authToken: AuthToken,
        currentUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            const alias = this.extractAlias(target);

            const user = await this.service.getUser(authToken, alias);

            if (!!user) {
                if (currentUser!.equals(user)) {
                    this.view.setDisplayedUser(currentUser);
                } else {
                    this.view.setDisplayedUser(user);
                }
            }
        }, "get user");
    }

    protected createService(): UserService {
        return new UserService();
    }

    private extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}
