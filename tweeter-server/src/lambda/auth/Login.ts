import { LoginRequest, LoginResponse } from 'tweeter-shared/src';
import { getUserService } from '../utils';

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
    const service = getUserService();
    const [user, token] = await service.login(request.alias, request.password);

    return {
        success: true,
        message: null,
        user,
        token,
    }
}