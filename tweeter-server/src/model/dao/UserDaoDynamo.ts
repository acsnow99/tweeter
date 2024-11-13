import { FakeData } from "tweeter-shared";
import { UserDao } from "./UserDao";
import { UserDto } from "tweeter-shared/src";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
  } from "@aws-sdk/lib-dynamodb";

export class UserDaoDynamo implements UserDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly tableName = "tweeter-users"
    private readonly aliasAttr = "alias";
    private readonly firstNameAttr = "first-name";
    private readonly lastNameAttr = "last-name";
    private readonly imageUrlAttr = "image-url";
    
    public getUser(alias: string) {
        return FakeData.instance.firstUser;
    }

    public async createUser(user: UserDto) {
        const params = {
            TableName: this.tableName,
            Item: {
              [this.aliasAttr]: user.alias,
              [this.firstNameAttr]: user.firstName,
              [this.lastNameAttr]: user.lastName,
              [this.imageUrlAttr]: user.imageUrl,
            },
          };
        await this.client.send(new PutCommand(params));
        return user;
    }
}
