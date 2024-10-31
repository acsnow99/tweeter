import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

export interface RegisterResponse {
    user: UserDto;
    authToken: AuthTokenDto;
}