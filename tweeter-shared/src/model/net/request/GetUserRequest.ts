import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetUserRequest extends TweeterRequest {
    readonly authToken: AuthTokenDto;
    readonly alias: string;
}