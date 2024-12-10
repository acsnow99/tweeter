import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";
import { User } from "tweeter-shared";

export class FillUserTableDao {
  //
  // Modify these values as needed to match your user table.
  //
  private readonly tableName = "tweeter-users";
  private readonly tableNamePass = "tweeter-passwords";
  private readonly userAliasAttribute = "alias";
  private readonly userFirstNameAttribute = "first-name";
  private readonly userLastNameAttribute = "last-name";
  private readonly userImageUrlAttribute = "image-url";
  private readonly passwordAttr = "password";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createUsers(userList: User[], password: string) {
    if (userList.length == 0) {
      console.log("zero followers to batch write");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const params = {
      RequestItems: {
        [this.tableName]: this.createPutUserRequestItems(
          userList
        ),
      },
    };

    const params2 = {
        RequestItems: {
          [this.tableNamePass]: this.createPutPassRequestItems(
            userList,
            hashedPassword
          ),
        },
      };

    try {
      const resp = await this.client.send(new BatchWriteCommand(params));
      await this.putUnprocessedItems(resp, params);
      const resp2 = await this.client.send(new BatchWriteCommand(params2));
      await this.putUnprocessedItems(resp2, params2);
    } catch (err) {
      throw new Error(
        `Error while batch writing users with params: ${params}: \n${err}`
      );
    }
  }

  private createPutUserRequestItems(userList: User[]) {
    return userList.map((user) =>
      this.createPutUserRequest(user)
    );
  }

  private createPutUserRequest(user: User) {
    const item = {
      [this.userAliasAttribute]: user.alias,
      [this.userFirstNameAttribute]: user.firstName,
      [this.userLastNameAttribute]: user.lastName,
      [this.userImageUrlAttribute]: user.imageUrl,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private createPutPassRequestItems(userList: User[], hashedPassword: string) {
    return userList.map((user) =>
      this.createPutPassRequest(user, hashedPassword)
    );
  }

  private createPutPassRequest(user: User, hashedPassword: string) {
    const item = {
      [this.userAliasAttribute]: user.alias,
      [this.passwordAttr]: hashedPassword,
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput
  ) {
    let delay = 10;
    let attempts = 0;

    while (
      resp.UnprocessedItems !== undefined &&
      Object.keys(resp.UnprocessedItems).length > 0
    ) {
      attempts++;

      if (attempts > 1) {
        // Pause before the next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Increase pause time for next attempt
        if (delay < 1000) {
          delay += 100;
        }
      }

      console.log(
        `Attempt ${attempts}. Processing ${
          Object.keys(resp.UnprocessedItems).length
        } unprocessed users.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}