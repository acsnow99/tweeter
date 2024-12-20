import { AuthToken, FakeData } from "tweeter-shared";
import { AuthDao } from "./AuthDao";
import { AuthTokenDto } from "tweeter-shared/src";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { compare, genSalt, hash } from "bcryptjs";
import crypto from 'crypto';

export class AuthDaoDynamo implements AuthDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly passwordTableName = "tweeter-passwords";
    private readonly sessionTableName = "tweeter-sessions";
    private readonly aliasAttr = "alias";
    private readonly passwordAttr = "password";
    private readonly tokenAttr = "token";
    private readonly timestampAttr = "timestamp";
    private readonly tokenTTL = 24 * 60 * 60 * 1000;

    public async createUserPassword(alias: string, password: string) {
        const salt = await genSalt();
        const hashedPassword = await hash(password, salt);
        const params = {
            TableName: this.passwordTableName,
            Item: {
              [this.aliasAttr]: alias,
              [this.passwordAttr]: hashedPassword,
            },
          };
        await this.client.send(new PutCommand(params));
        return alias;
    }

    public async createSession(alias: string, password: string) {
        const getCommand = new GetCommand({
            TableName: this.passwordTableName,
            Key: {
                [this.aliasAttr]: alias,
            },
        });
        const getResponse = await this.client.send(getCommand);
        const dbPassword = getResponse.Item ? getResponse.Item.password : "";
        if (dbPassword === "" || !await compare(password, dbPassword)) {
            return null;
        }
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

    public deleteSession(authToken: AuthTokenDto) {
        return;
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
