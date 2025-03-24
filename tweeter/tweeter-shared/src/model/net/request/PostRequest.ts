import { StatusDto } from "../../dto/StatusDto";

export interface PostRequest {
    readonly token: string;
    readonly newStatus: StatusDto;
}
