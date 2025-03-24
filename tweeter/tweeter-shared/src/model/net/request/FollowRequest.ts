import { UserDto } from "../../dto/UserDto";
import { AuthorizedRequest } from "./AuthorizedRequest";

export interface FollowRequest extends AuthorizedRequest {
    readonly user: UserDto;
}
