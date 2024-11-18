import { DaoFactoryDynamo } from "../model/dao/DaoFactoryDynamo";
import { UserService } from "../model/service/UserService";

export function getUserService() {
    return new UserService(new DaoFactoryDynamo());
}
