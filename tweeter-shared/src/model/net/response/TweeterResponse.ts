import { UserDto } from "../../dto/UserDto";

export interface TweeterResponse {
    readonly success: boolean,
    readonly message: string | null,
}