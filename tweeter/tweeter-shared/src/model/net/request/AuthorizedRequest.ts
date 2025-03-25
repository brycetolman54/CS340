import { TweeterRequest } from "./TweeterRequest";

export interface AuthorizedRequest extends TweeterRequest {
    readonly token: string;
}
