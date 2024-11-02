import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetUserRequest extends TweeterRequest {
    readonly authToken: AuthTokenDto;
    readonly alias: string;
}