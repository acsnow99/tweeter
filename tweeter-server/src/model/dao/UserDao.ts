import { UserDto } from "tweeter-shared";

export interface UserDao {
    getUser: (alias: string) => Promise<UserDto | null>;
    createUser: (user: UserDto) => Promise<UserDto | null>;
}
