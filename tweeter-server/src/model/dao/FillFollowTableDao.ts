import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  BatchWriteCommandOutput,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

export class FillFollowTableDao {
  //
  // Modify these values as needed to match your follow table.
  //
  private readonly tableName = "tweeter-follow";
  private readonly followeeAttr = "followee-alias";
  private readonly followerAttr = "follower-alias";
  private readonly followeeNameAttr = "followee-name";
  private readonly followerNameAttr = "follower-name";
  private readonly followerImageAttr = "follower-image";
  private readonly followeeImageAttr = "followee-image";
  private readonly altIndexName = "follows_index";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createFollows(followeeAlias: string, followerAliasList: string[]) {
    if (followerAliasList.length == 0) {
      console.log("Zero followers to batch write");
      return;
    } else {
      const params = {
        RequestItems: {
          [this.tableName]: this.createPutFollowRequestItems(
            followeeAlias,
            followerAliasList
          ),
        },
      };

      try {
        const response = await this.client.send(new BatchWriteCommand(params));
        await this.putUnprocessedItems(response, params);
      } catch (err) {
        throw new Error(
          `Error while batch writing follows with params: ${params} \n${err}`
        );
      }
    }
  }

  private createPutFollowRequestItems(
    followeeAlias: string,
    followerAliasList: string[]
  ) {
    return followerAliasList.map((followerAlias) =>
      this.createPutFollowRequest(followerAlias, followeeAlias)
    );
  }

  private createPutFollowRequest(followerAlias: string, followeeAlias: string) {
    const item = {
      [this.followerAttr]: followerAlias,
      [this.followeeAttr]: followeeAlias,
      [this.followeeNameAttr]: followeeAlias,
      [this.followerNameAttr]: followerAlias,
      [this.followerImageAttr]: 'https://cs340tweeter-images.s3.us-east-1.amazonaws.com/image/test0',
      [this.followeeImageAttr]: 'https://cs340tweeter-images.s3.us-east-1.amazonaws.com/image/test0',
    };

    return {
      PutRequest: {
        Item: item,
      },
    };
  }

  private async putUnprocessedItems(
    resp: BatchWriteCommandOutput,
    params: BatchWriteCommandInput,
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
        } unprocessed follow items.`
      );

      params.RequestItems = resp.UnprocessedItems;
      resp = await this.client.send(new BatchWriteCommand(params));
    }
  }
}