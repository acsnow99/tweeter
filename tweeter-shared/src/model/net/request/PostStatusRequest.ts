import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PostStatusRequest extends TweeterRequest {
    readonly authToken: AuthTokenDto;
    readonly newStatus: StatusDto;
}