import { UserDto } from "../../dto/UserDto";

export interface LoginResponse {
    user: UserDto;
    token: string;
}