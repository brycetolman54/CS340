import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StatusDAO } from "./StatusDAO";
import { UserDAO } from "./UserDAO";

export interface FactoryDAO {
    getFollowDAO: () => FollowDAO;
    getImageDAO: () => ImageDAO;
    getUserDAO: () => UserDAO;
    getStatusDAO: () => StatusDAO;
}
