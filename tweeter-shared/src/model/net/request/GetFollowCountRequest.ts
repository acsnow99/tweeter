import { UserDto } from "../../dto/UserDto";

export interface GetFollowCountRequest {
    readonly token: string;
    readonly user: UserDto;
}