import { AuthTokenDto } from "tweeter-shared/src";

export interface SessionDao {
    // returns alias if valid
    createSession: (alias: string) => Promise<AuthTokenDto | null>;
    deleteSession: (authToken: AuthTokenDto) => Promise<void>;
    verifyToken: (token: string) => Promise<boolean>;
    // returns alias if valid authToken
    readSession: (token: string) => Promise<string | null>;
}
