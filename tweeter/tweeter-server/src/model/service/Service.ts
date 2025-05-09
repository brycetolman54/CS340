import { AuthorizationDAO } from "../daos/general/AuthorizationDAO";
import { FactoryDAO } from "../daos/general/FactoryDAO";

export class Service {
    protected factory: FactoryDAO;
    protected authorizationDAO: AuthorizationDAO;

    public constructor(factory: FactoryDAO) {
        this.factory = factory;
        this.authorizationDAO = factory.getAuthorizationDAO();
    }

    protected async checkToken(token: string): Promise<void> {
        let res = await this.authorizationDAO.checkToken(token);
        if (!res) {
            throw new Error("[Bad Request] invalid authorization token");
        }
    }
}
