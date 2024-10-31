import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

export interface GetIsFollowerStatusRequest {
    readonly authToken: AuthTokenDto;
    readonly user: UserDto;
    readonly selectedUser: UserDto;
}
