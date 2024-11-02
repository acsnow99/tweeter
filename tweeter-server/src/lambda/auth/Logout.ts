import { LogoutRequest, LogoutResponse } from 'tweeter-shared/src';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
    const service = new UserService();
    const response = await service.logout(request.authToken);
    return {
        success: true,
        message: null
    }
}
