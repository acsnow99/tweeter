import { GetUserRequest, GetUserResponse } from 'tweeter-shared/src';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
    const service = new UserService();
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