import { AuthTokenDto } from "tweeter-shared/src";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import crypto from 'crypto';
import { SessionDao } from "./SessionDao";

export class SessionDaoDynamo implements SessionDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly passwordTableName = "tweeter-passwords";
    private readonly sessionTableName = "tweeter-sessions";
    private readonly aliasAttr = "alias";
    private readonly passwordAttr = "password";
    private readonly tokenAttr = "token";
    private readonly timestampAttr = "timestamp";
    private readonly tokenTTL = 24 * 60 * 60 * 1000;

    public async createSession(alias: string) {
        const token = crypto.randomBytes(32).toString('hex');
        const authToken = {
            token: token,
            timestamp: Date.now()
        };
        const params = {
            TableName: this.sessionTableName,
            Item: {
              [this.tokenAttr]: token,
              [this.timestampAttr]: authToken.timestamp,
              [this.aliasAttr]: alias
            },
        };
        await this.client.send(new PutCommand(params));
        return authToken;
    }

    public async deleteSession(authToken: AuthTokenDto) {
        const params = {
            TableName: this.passwordTableName,
            Key: {
              PartitionKey: this.tokenAttr,
              SortKey: authToken.token, 
            },
          };
        const command = new DeleteCommand(params);
        await this.client.send(command);
    }

    public async verifyToken(token: string) {
        const getCommand = new GetCommand({
            TableName: this.sessionTableName,
            Key: {
                [this.tokenAttr]: token,
            },
        });
        const getResponse = await this.client.send(getCommand);
        const exists = getResponse.Item ? getResponse.Item.token ? true : false : false;
        const isRecent = getResponse.Item ? Date.now() - getResponse.Item.timestamp <= this.tokenTTL : false;
        return exists && isRecent;
    }

    public async readSession(token: string) {
        const getCommand = new GetCommand({
            TableName: this.sessionTableName,
            Key: {
                [this.tokenAttr]: token,
            },
        });
        const getResponse = await this.client.send(getCommand);
        const alias = getResponse.Item ? getResponse.Item.alias ? getResponse.Item.alias : null : null;
        return alias;
    }
}
