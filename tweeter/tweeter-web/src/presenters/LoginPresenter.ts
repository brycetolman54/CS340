import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
    protected authenticate(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        return this.service.login(alias, password);
    }

    protected navigate(originalUrl: string | undefined): void {
        if (!!originalUrl) {
            this.view.navigate(originalUrl);
        } else {
            this.view.navigate("/");
        }
    }

    protected getOperationDescription(): string {
        return "log user in";
    }
}
