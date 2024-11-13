import { UserDto } from "tweeter-shared";

export interface UserDao {
    getUser: (alias: string) => UserDto | null;
    createUser: (user: UserDto) => UserDto | null;
}
