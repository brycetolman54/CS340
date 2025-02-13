import { UserService } from "../model/UserService";
import {
    AuthenticationPresenter,
    AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
    private userService: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this.userService = new UserService();
    }

    public async doLogin(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl: string | undefined
    ) {
        try {
            this.isLoading = true;

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
            this.isLoading = false;
        }
    }
}
