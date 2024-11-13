import { FakeData } from "tweeter-shared";
import { UserDao } from "./UserDao";
import { UserDto } from "tweeter-shared/src";

export class UserDaoDynamo implements UserDao {
    public getUser(alias: string) {
        return FakeData.instance.firstUser;
    }

    public createUser(user: UserDto) {
        return user;
    }
}
