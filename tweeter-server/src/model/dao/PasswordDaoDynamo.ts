import { AuthDao } from "./AuthDao";
import { AuthTokenDto } from "tweeter-shared/src";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { compare, genSalt, hash } from "bcryptjs";
import crypto from 'crypto';
import { PasswordDao } from "./PasswordDao";

export class PasswordDaoDynamo implements PasswordDao {
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

    public async checkUserPassword(alias: string, password: string) {
        const getCommand = new GetCommand({
            TableName: this.passwordTableName,
            Key: {
                [this.aliasAttr]: alias,
            },
        });
        const getResponse = await this.client.send(getCommand);
        const dbPassword = getResponse.Item ? getResponse.Item.password : "";
        return dbPassword !== "" && await compare(password, dbPassword);
    }
}
