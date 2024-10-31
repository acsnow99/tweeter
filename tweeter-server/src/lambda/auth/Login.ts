import { LoginRequest, LoginResponse } from 'tweeter-shared/src';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
    const service = new UserService();
    const [user, token] = await service.login(request.alias, request.password);

    return {
        success: true,
        message: null,
        user,
        token,
    }
}