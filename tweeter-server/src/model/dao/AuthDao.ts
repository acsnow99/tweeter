import { AuthTokenDto } from "tweeter-shared/src";

export interface AuthDao {
    // returns alias if valid
    createUserPassword: (alias: string, password: string) => Promise<string | null>;
    createSession: (alias: string, password: string) => Promise<AuthTokenDto | null>;
    deleteSession: (authToken: AuthTokenDto) => void;
    verifyToken: (authToken: AuthTokenDto) => Promise<boolean>;
    // returns alias if valid authToken
    readSession: (authToken: AuthTokenDto) => string | null;
}
