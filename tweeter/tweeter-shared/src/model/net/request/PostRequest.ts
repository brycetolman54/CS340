import { StatusDto } from "../../dto/StatusDto";
import { AuthorizedRequest } from "./AuthorizedRequest";

export interface PostRequest extends AuthorizedRequest {
    readonly token: string;
    readonly newStatus: StatusDto;
}
