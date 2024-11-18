import { GetUserRequest, GetUserResponse } from 'tweeter-shared/src';
import { getUserService } from "../utils";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const service = getUserService();
    const {
        authToken,
        alias,
    } = request;
    const foundUser = await service.getUser(authToken, alias);

    return {
        success: true,
        message: null,
        user: foundUser,
    }
}