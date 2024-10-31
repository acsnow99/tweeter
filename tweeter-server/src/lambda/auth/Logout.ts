import { LogoutRequest } from 'tweeter-shared/src';
import { UserService } from '../../model/service/UserService';

export const handler = async (request: LogoutRequest) => {
    const service = new UserService();
    await service.logout(request.authToken);
}
