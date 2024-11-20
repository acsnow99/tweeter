import { FakeData, User } from "tweeter-shared";
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
    
    public async getUser(alias: string) {
      const getCommand = new GetCommand({
        TableName: this.tableName,
        Key: {
          alias: alias,
        },
      });
      const getResponse = await this.client.send(getCommand);
      if (!getResponse.Item || !getResponse.Item[this.firstNameAttr] || !getResponse.Item[this.lastNameAttr] || !getResponse.Item[this.aliasAttr]) {
        return null;
      }
      const user = new User(getResponse.Item[this.firstNameAttr], getResponse.Item[this.lastNameAttr], getResponse.Item[this.aliasAttr], getResponse.Item[this.imageUrlAttr]).dto;
      return user;
    }

    public async createUser(user: UserDto) {
      const existingUser = await this.getUser(user.alias);
      if (existingUser === null) {
        return null;
      }
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
