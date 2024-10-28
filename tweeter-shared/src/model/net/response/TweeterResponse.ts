import { UserDto } from "../../dto/UserDto";

export  interface TweeterResponse {
    readonly items: UserDto[] | null,
    readonly hasMore: boolean
}