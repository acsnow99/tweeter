import { AuthToken, FakeData } from "tweeter-shared";
import { AuthDao } from "./AuthDao";
import { AuthTokenDto } from "tweeter-shared/src";

export class AuthDaoDynamo implements AuthDao {
    public createUserPassword(alias: string, password: string) {
        return alias;
    }

    public createSession(alias: string, password: string) {
        return {
            token: FakeData.instance.authToken.token,
            timestamp: 0
        };
    }

    public deleteSession(authToken: AuthTokenDto) {
        return;
    }

    public verifyToken(authToken: AuthTokenDto) {
        return true;
    }

    public readSession(authToken: AuthTokenDto) {
        return FakeData.instance.firstUser?.alias ? FakeData.instance.firstUser?.alias : null;
    }
}
