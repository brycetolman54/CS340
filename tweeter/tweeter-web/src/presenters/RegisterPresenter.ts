import { Buffer } from "buffer";
import { AuthenticationPresenter } from "./AuthenticationPresenter";
import { User, AuthToken } from "tweeter-shared";

export class RegisterPresenter extends AuthenticationPresenter {
    protected authenticate(
        alias: string,
        password: string,
        firstName: string,
        lastName: string,
        imageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        return this.service.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes,
            imageFileExtension
        );
    }

    protected navigate(originalUrl: string | undefined): void {
        this.view.navigate("/");
    }

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl?.(URL.createObjectURL(file));

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

                this.view.setImageBytes?.(bytes);
            };
            reader.readAsDataURL(file);

            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.view.setImageFileExtension?.(fileExtension);
            }
        } else {
            this.view.setImageUrl?.("");
            this.view.setImageBytes?.(new Uint8Array());
        }
    }

    getFileExtension = (file: File): string | undefined => {
        return file.name.split(".").pop();
    };

    protected getOperationDescription(): string {
        return "register user";
    }
}
