import { RegisterRequest, RegisterResponse } from 'tweeter-shared'
import { getUserService } from '../utils';

export const handler = async (request: RegisterRequest): Promise<RegisterResponse> => {
    const service = getUserService();
    const [user, authToken] = await service.register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);

    return {
        success: true,
        message: null,
        user,
        authToken,
    }
}