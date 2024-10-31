import { UserDto } from "../../dto/UserDto";

export interface GetFollowerCountRequest {
    readonly token: string;
    readonly user: UserDto;
}