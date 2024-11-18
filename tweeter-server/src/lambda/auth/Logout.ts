import { LogoutRequest, LogoutResponse } from 'tweeter-shared/src';
import { getUserService } from '../utils';

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
    const service = getUserService();
    const response = await service.logout(request.authToken);
    return {
        success: true,
        message: null
    }
}
