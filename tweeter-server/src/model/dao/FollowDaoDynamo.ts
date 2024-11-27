import { AuthToken, FakeData } from "tweeter-shared";
import { AuthDao } from "./AuthDao";
import { AuthTokenDto } from "tweeter-shared/src";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { compare, genSalt, hash } from "bcryptjs";
import crypto from 'crypto';
import { FollowDao } from "./FollowDao";

export class FollowDaoDynamo implements FollowDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly tableName = "tweeter-follow";
    private readonly followeeAttr = "followee-alias";
    private readonly followerAttr = "follower-alias";
    private readonly followeeNameAttr = "followee-name";
    private readonly followerNameAttr = "follower-name";

    public async createFollowRelationship(alias: string, toFollowAlias: string, name: string, toFollowName: string) {
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

    public async deleteFollowRelationship(alias: string, toUnfollowAlias: string, name: string, toUnfollowName: string) {
        const params = {
            TableName: this.tableName,
            Key: "follows-index"
          };
        await this.client.send(new DeleteCommand(params));
    }
}
