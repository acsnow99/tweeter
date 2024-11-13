import { AuthDaoDynamo } from "./AuthDaoDynamo";
import { UserDaoDynamo } from "./UserDaoDynamo";

export class DaoFactory {
    public getUserDao() {
        return new UserDaoDynamo();
    }

    public getAuthDao() {
        return new AuthDaoDynamo();
    }
}
