import { AuthToken, FakeData } from "tweeter-shared";
import { AuthDao } from "./AuthDao";
import { AuthTokenDto } from "tweeter-shared/src";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthDaoDynamo implements AuthDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private tableName = "tweeter-passwords";
    private readonly aliasAttr = "alias";
    private readonly passwordAttr = "password";

    public async createUserPassword(alias: string, password: string) {
        const params = {
            TableName: this.tableName,
            Item: {
              [this.aliasAttr]: alias,
              [this.passwordAttr]: password,
            },
          };
        await this.client.send(new PutCommand(params));
        return alias;
    }

    public async createSession(alias: string, password: string) {
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
