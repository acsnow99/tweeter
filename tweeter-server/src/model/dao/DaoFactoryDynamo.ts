import { AuthDaoDynamo } from "./AuthDaoDynamo";
import { UserDaoDynamo } from "./UserDaoDynamo";
import { DaoFactory } from "./DaoFactory";

export class DaoFactoryDynamo implements DaoFactory {
    public getUserDao() {
        return new UserDaoDynamo();
    }

    public getAuthDao() {
        return new AuthDaoDynamo();
    }
}
