import { UserService } from "../../model/service/UserService"
import { GetFollowerCountRequest, GetFollowerCountResponse } from 'tweeter-shared/src';


export const handler = async (request: GetFollowerCountRequest): Promise<GetFollowerCountResponse> => {
    const service = new UserService();
    const {
        token,
        user
    } = request;
    const count = await service.getFollowerCount(token, user);
    return {
        success: true,
        message: null,
        count: count,
    }
}