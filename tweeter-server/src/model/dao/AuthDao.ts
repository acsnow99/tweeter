import { AuthTokenDto } from "tweeter-shared/src";

export interface AuthDao {
    // returns alias if valid
    createUserPassword: (alias: string, password: string) => string | null;
    createSession: (alias: string, password: string) => AuthTokenDto | null;
    deleteSession: (authToken: AuthTokenDto) => void;
    verifyToken: (authToken: AuthTokenDto) => boolean;
    // returns alias if valid authToken
    readSession: (authToken: AuthTokenDto) => string | null;
}
