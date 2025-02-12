import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface UserNavigationView {
    displayErrorMessage: (message: string) => void;
    setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
    private userService: UserService;
    private view: UserNavigationView;

    public constructor(view: UserNavigationView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async navigateToUser(
        target: string,
        authToken: AuthToken,
        currentUser: User
    ) {
        try {
            const alias = this.extractAlias(target);

            const user = await this.userService.getUser(authToken, alias);

            if (!!user) {
                if (currentUser!.equals(user)) {
                    this.view.setDisplayedUser(currentUser);
                } else {
                    this.view.setDisplayedUser(user);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to get user because of exception: ${error}`
            );
        }
    }

    private extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}
