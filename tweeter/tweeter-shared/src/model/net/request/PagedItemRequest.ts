import { AuthorizedRequest } from "./AuthorizedRequest";

export interface PagedItemRequest<T> extends AuthorizedRequest {
    readonly token: string;
    readonly userAlias: string;
    readonly pageSize: number;
    readonly lastItem: T | null;
}
