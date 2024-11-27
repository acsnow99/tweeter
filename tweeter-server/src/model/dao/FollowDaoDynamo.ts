import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDao } from "./FollowDao";

export class FollowDaoDynamo implements FollowDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly tableName = "tweeter-follow";
    private readonly followeeAttr = "followee-alias";
    private readonly followerAttr = "follower-alias";
    private readonly followeeNameAttr = "followee-name";
    private readonly followerNameAttr = "follower-name";

    public async insertFollowRelationship(alias: string, toFollowAlias: string, name: string, toFollowName: string) {
        const params = {
            TableName: this.tableName,
            Item: {
              [this.followeeAttr]: toFollowAlias,
              [this.followerAttr]: alias,
              [this.followeeNameAttr]: toFollowName,
              [this.followerNameAttr]: name,
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

    public getFollowers(alias: string) {
      return [];
    }

    public getFollowees(alias: string) {
      return [];
    }

    public getFollowerCount(alias: string) {
      return 0;
    }

    public getFolloweeCount(alias: string) {
      return 0;
    }
}
