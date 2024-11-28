import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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

    public async getFollowers(alias: string) {
      const getCommand = new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: `#followeeAttr = :aliasValue`,
        ExpressionAttributeNames: {
          '#followeeAttr': this.followeeAttr
        },
        ExpressionAttributeValues: {
          ":aliasValue": alias,
        },
      });
      const getResponse = await this.client.send(getCommand);
      const followers = getResponse.Items ? getResponse.Items.map((item) => {
        const [lastName, firstName] = item[this.followerNameAttr].split(", ");
        return new User(firstName, lastName, item[this.followerAttr], item[this.followerImageAttr]).dto;
      }) : [];
      return followers;
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
      console.log("getFollowees", getResponse.Items);
      const followees = getResponse.Items ? getResponse.Items.map((item) => {
        const [lastName, firstName] = item[this.followeeNameAttr].split(", ");
        return new User(firstName, lastName, item[this.followeeAttr], item[this.followeeImageAttr]).dto;
      }) : [];
      console.log("getFollowees post process", followees);
      return followees;
    }

    public async getFollowerCount(alias: string) {
      return 0;
    }

    public async getFolloweeCount(alias: string) {
      return 0;
    }
}
