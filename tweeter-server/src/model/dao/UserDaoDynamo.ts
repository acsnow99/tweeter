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
        // Set this to make sure that recent writes are reflected.
        // For more information, see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html.
        ConsistentRead: true,
      });
      const getResponse = await this.client.send(getCommand);
      if (!getResponse.Item || !getResponse.Item.firstName || !getResponse.Item.lastName || !getResponse.Item.alias) {
        return null;
      }
      const user = new User(getResponse.Item.firstName, getResponse.Item.lastName, getResponse.Item.alias, getResponse.Item.imageUrl).dto;
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
