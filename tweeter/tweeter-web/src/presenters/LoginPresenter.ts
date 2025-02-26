import { User, AuthToken } from "tweeter-shared";
import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { UserService } from "../model/UserService";

export class LoginPresenter extends AuthenticationPresenter {
    public authenticate(
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

    protected createService(): UserService {
        return new UserService();
    }
}
