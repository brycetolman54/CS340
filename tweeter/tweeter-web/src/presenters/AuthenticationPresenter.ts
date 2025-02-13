import { User, AuthToken } from "tweeter-shared";

export interface AuthenticationView {
    navigate: (path: string) => void;
    updateUserInfo: (
        user1: User,
        user2: User,
        authToken: AuthToken,
        rememberMe: boolean
    ) => void;
    displayErrorMessage: (message: string) => void;
    setImageUrl?: (url: string) => void;
    setImageBytes?: (bytes: Uint8Array) => void;
    setImageFileExtension?: (extension: string) => void;
}

export class AuthenticationPresenter {
    private _view: AuthenticationView;

    private _isLoading = false;

    protected constructor(view: AuthenticationView) {
        this._view = view;
    }

    protected get view() {
        return this._view;
    }

    public get isLoading() {
        return this._isLoading;
    }

    public set isLoading(value: boolean) {
        this._isLoading = value;
    }
}
