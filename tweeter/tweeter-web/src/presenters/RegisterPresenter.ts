import { Buffer } from "buffer";
import { UserService } from "../model/UserService";
import {
    AuthenticationPresenter,
    AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView {
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
    setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter extends AuthenticationPresenter {
    private userService: UserService;
    private registerView;

    public constructor(view: AuthenticationView, registerView: RegisterView) {
        super(view);
        this.registerView = registerView;
        this.userService = new UserService();
    }

    public async doRegister(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: Uint8Array,
        imageFileExtension: string,
        rememberMe: boolean
    ) {
        try {
            this.isLoading = true;

            const [user, authToken] = await this.userService.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes,
                imageFileExtension
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigate("/");
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        } finally {
            this.isLoading = false;
        }
    }

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.registerView.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.registerView.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);

            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.registerView.setImageFileExtension(fileExtension);
            }
        } else {
            this.registerView.setImageUrl("");
            this.registerView.setImageBytes(new Uint8Array());
        }
    }

    getFileExtension = (file: File): string | undefined => {
        return file.name.split(".").pop();
    };
}
