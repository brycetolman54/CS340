import { AuthorizationDAO } from "../general/AuthorizationDAO";
import { FactoryDAO } from "../general/FactoryDAO";
import { DynamoAuthorizationDAO } from "./DynamoAuthorizationDAO";
import { DynamoFollowDAO } from "./DynamoFollowDAO";
import { DynamoImageDAO } from "./DynamoImageDAO";
import { DynamoStatusDAO } from "./DynamoStatusDAO";
import { DynamoUserDAO } from "./DynamoUserDAO";

export class DynamoFactory implements FactoryDAO {
    public getFollowDAO() {
        return new DynamoFollowDAO();
    }

    public getImageDAO() {
        return new DynamoImageDAO();
    }

    public getStatusDAO() {
        return new DynamoStatusDAO();
    }

    public getUserDAO() {
        return new DynamoUserDAO();
    }

    public getAuthorizationDAO() {
        return new DynamoAuthorizationDAO();
    }
}
