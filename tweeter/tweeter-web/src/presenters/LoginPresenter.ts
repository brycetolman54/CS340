import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/UserService";

export interface LoginView {
    navigate: (path: string) => void;
    updateUserInfo: (
        user1: User,
        user2: User,
        authToken: AuthToken,
        rememberMe: boolean
    ) => void;
    displayErrorMessage: (message: string) => void;
}

export class LoginPresenter {
    private view: LoginView;
    private userService: UserService;

    private _isLoading = false;

    public constructor(view: LoginView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async doLogin(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl: string | undefined
    ) {
        try {
            this._isLoading = true;

            const [user, authToken] = await this.userService.login(
                alias,
                password
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);

            if (!!originalUrl) {
                this.view.navigate(originalUrl);
            } else {
                this.view.navigate("/");
            }
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        } finally {
            this._isLoading = false;
        }
    }

    public get isLoading() {
        return this._isLoading;
    }
}
