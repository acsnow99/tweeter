import { TweeterResponse } from "./TweeterResponse";

export interface PagedUserItemResponse extends TweeterResponse {
    readonly success: boolean,
    readonly message: string | null,
}