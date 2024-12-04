import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDao } from "./FollowDao";
import { User } from "tweeter-shared";

export class FollowDaoDynamo implements FollowDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly tableName = "tweeter-follow";
    private readonly followeeAttr = "followee-alias";
    private readonly followerAttr = "follower-alias";
    private readonly followeeNameAttr = "followee-name";
    private readonly followerNameAttr = "follower-name";
    private readonly followerImageAttr = "follower-image";
    private readonly followeeImageAttr = "followee-image";
    private readonly altIndexName = "follows_index";

    public async insertFollowRelationship(alias: string, toFollowAlias: string, name: string, toFollowName: string, imageUrl: string, toFollowImageUrl: string) {
        const params = {
            TableName: this.tableName,
            Item: {
              [this.followeeAttr]: toFollowAlias,
              [this.followerAttr]: alias,
              [this.followeeNameAttr]: toFollowName,
              [this.followerNameAttr]: name,
              [this.followerImageAttr]: imageUrl,
              [this.followeeImageAttr]: toFollowImageUrl
            },
          };
        await this.client.send(new PutCommand(params));
    }

    public async deleteFollowRelationship(alias: string, toUnfollowAlias: string) {
        const params = {
            TableName: this.tableName,
            Key: {
              [this.followeeAttr]: toUnfollowAlias,
              [this.followerAttr]: alias,
            },
          };
        await this.client.send(new DeleteCommand(params));
    }

    public async getFollowers(alias: string, limit?: number, startKey?: { followeeAlias: string; followerAlias: string }): Promise<[string[], boolean]> {
      const params: QueryCommandInput = {
        TableName: this.tableName,
        KeyConditionExpression: `#followeeAttr = :aliasValue`,
        ExpressionAttributeNames: {
          '#followeeAttr': this.followeeAttr
        },
        ExpressionAttributeValues: {
          ":aliasValue": alias,
        },
      };

      if (limit) {
        params.Limit = limit;
      }
  
      if (startKey) {
          params.ExclusiveStartKey = {
              [this.followeeAttr]: startKey.followeeAlias,
              [this.followerAttr]: startKey.followerAlias,
          };
      }
      const getResponse = await this.client.send(new QueryCommand(params));
      const followers: string[] = getResponse.Items ? getResponse.Items.map((item) => {
        return item[this.followerAttr];
      }) : [];

      const hasMore = !!getResponse.LastEvaluatedKey;

      return [followers, hasMore];
    }

    public async getFollowees(alias: string) {
      const getCommand = new QueryCommand({
        TableName: this.tableName,
        IndexName: this.altIndexName,
        KeyConditionExpression: `#followerAttr = :aliasValue`,
        ExpressionAttributeNames: {
          '#followerAttr': this.followerAttr,
        },
        ExpressionAttributeValues: {
          ":aliasValue": alias,
        },
      });
      const getResponse = await this.client.send(getCommand);
      const followees: string[] = getResponse.Items ? getResponse.Items.map((item) => {
        return item[this.followeeAttr];
      }) : [];
      return followees;
    }

    public async getFollowerCount(alias: string) {
      const getCommand = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: `#followeeAttr = :aliasValue`,
        ExpressionAttributeNames: {
          '#followeeAttr': this.followeeAttr
        },
        ExpressionAttributeValues: {
          ":aliasValue": alias,
        },
        Select: "COUNT",
      });
      const getResponse = await this.client.send(getCommand);
      return getResponse.Count ?? 0;
    }

    public async getFolloweeCount(alias: string) {
      const getCommand = new QueryCommand({
        TableName: this.tableName,
        IndexName: this.altIndexName,
        KeyConditionExpression: `#followerAttr = :aliasValue`,
        ExpressionAttributeNames: {
          '#followerAttr': this.followerAttr,
        },
        ExpressionAttributeValues: {
          ":aliasValue": alias,
        },
        Select: "COUNT",
      });
      const getResponse = await this.client.send(getCommand);
      return getResponse.Count ?? 0;
    }

    public async getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean> {
      const getCommand = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: `#followeeAttr = :followeeValue AND #followerAttr = :followerValue`,
        ExpressionAttributeNames: {
          '#followeeAttr': this.followeeAttr,
          '#followerAttr': this.followerAttr, 
        },
        ExpressionAttributeValues: {
          ":followeeValue": followeeAlias,
          ":followerValue": followerAlias,
        },
      });
      const getResponse = await this.client.send(getCommand);
      return getResponse.Items?.length !== 0 && getResponse.Items !== undefined;
    }
}
