import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/UserService";

export interface AuthenticationView extends View {
    navigate: (path: string) => void;
    updateUserInfo: (
        user1: User,
        user2: User,
        authToken: AuthToken,
        rememberMe: boolean
    ) => void;
    setImageUrl?: (url: string) => void;
    setImageBytes?: (bytes: Uint8Array) => void;
    setImageFileExtension?: (extension: string) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
    private _isLoading = false;

    private _service: UserService;

    public constructor(view: AuthenticationView) {
        super(view);
        this._service = new UserService();
    }

    protected get service(): UserService {
        return this._service;
    }

    public get isLoading() {
        return this._isLoading;
    }

    public set isLoading(value: boolean) {
        this._isLoading = value;
    }

    public async doAuthentication(
        alias: string,
        password: string,
        rememberMe: boolean,
        originalUrl: string | undefined,
        firstName: string = "",
        lastName: string = "",
        imageBytes: Uint8Array = new Uint8Array(),
        imageFileExtension: string = ""
    ) {
        this.doFailureReportingOperation(
            async () => {
                this.isLoading = true;

                const [user, authToken] = await this.authenticate(
                    alias,
                    password,
                    firstName,
                    lastName,
                    imageBytes,
                    imageFileExtension
                );

                this.view.updateUserInfo(user, user, authToken, rememberMe);

                this.navigate(originalUrl);
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    protected abstract authenticate(
        alias: string,
        password: string,
        firstName: string,
        lastName: string,
        imageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]>;

    protected abstract navigate(originalUrl: string | undefined): void;
}
