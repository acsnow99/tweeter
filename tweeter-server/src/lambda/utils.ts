import { DaoFactoryDynamo } from "../model/dao/DaoFactoryDynamo";
import { StatusService } from "../model/service/StatusService";
import { UserService } from "../model/service/UserService";

export function getUserService() {
    return new UserService(new DaoFactoryDynamo());
}

export function getStatusService() {
    return new StatusService(new DaoFactoryDynamo());
}
