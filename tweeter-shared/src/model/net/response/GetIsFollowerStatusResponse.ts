import { TweeterResponse } from "./TweeterResponse";

export interface GetIsFollowerStatusResponse extends TweeterResponse {
    status: boolean;
}