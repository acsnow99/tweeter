import { Status, StatusDto, User } from "tweeter-shared";
import { StatusDao } from "./StatusDao";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared/src";

export class StatusDaoDynamo implements StatusDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly statusesTableName = "tweeter-statuses";
    private readonly feedsTableName = "tweeter-feeds";
    private readonly aliasAttr = "alias";
    private readonly posterAliasAttr = "posterAlias";
    private readonly firstNameAttr = "firstName";
    private readonly lastNameAttr = "lastName";
    private readonly imageUrlAttr = "imageUrl";
    private readonly followerAliasAttr = "followerAlias"
    private readonly timestampAttr = "timestamp";
    private readonly postAttr = "post";

    public async getStoryPage(alias: string, lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
        const params: QueryCommandInput = {
            TableName: this.statusesTableName,
            KeyConditionExpression: `#aliasAttr = :aliasValue`,
            ExpressionAttributeNames: {
              '#aliasAttr': this.aliasAttr
            },
            ExpressionAttributeValues: {
              ":aliasValue": alias,
            },
            Limit: pageSize,
            ScanIndexForward: false,
        };

        if (lastItem) {
            params['ExclusiveStartKey'] = {
                [this.aliasAttr]: lastItem.user.alias,
                [this.timestampAttr]: lastItem.timestamp,
            };
        }
        const getCommand = new QueryCommand(params);
        const getResponse = await this.client.send(getCommand);
        const stories = getResponse.Items ? getResponse.Items.map((item) => new Status(item.post, new User(item.firstName, item.lastName, item.alias, item.imageUrl), item.timestamp).dto) : [];
        const hasMore = !!getResponse.LastEvaluatedKey;
        return [stories, hasMore];
    };

    public async getFeedPage(alias: string, lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
        const params: QueryCommandInput = {
            TableName: this.feedsTableName,
            KeyConditionExpression: `#aliasAttr = :aliasValue`,
            ExpressionAttributeNames: {
              '#aliasAttr': this.followerAliasAttr
            },
            ExpressionAttributeValues: {
              ":aliasValue": alias,
            },
            Limit: pageSize,
            ScanIndexForward: false,
        };

        if (lastItem) {
            params['ExclusiveStartKey'] = {
                [this.followerAliasAttr]: alias,
                [this.timestampAttr]: lastItem.timestamp,
            };
        }
        const getCommand = new QueryCommand(params);
        const getResponse = await this.client.send(getCommand);
        const feeds = getResponse.Items ? getResponse.Items.map((item) => new Status(item.post, new User(item.firstName, item.lastName, item.alias, item.imageUrl), item.timestamp).dto) : [];
        const hasMore = !!getResponse.LastEvaluatedKey;
        return [feeds, hasMore];
    };

    public async createStatus(user: UserDto, newStatus: StatusDto): Promise<void> {
        const params = {
          TableName: this.statusesTableName,
          Item: {
            [this.aliasAttr]: user.alias,
            [this.firstNameAttr]: user.firstName,
            [this.lastNameAttr]: user.lastName,
            [this.imageUrlAttr]: user.imageUrl,
            [this.timestampAttr]: newStatus.timestamp,
            [this.postAttr]: newStatus.post,
          },
        };
      await this.client.send(new PutCommand(params));
    };

    public async createFeedItems(followerAliases: string[], user: UserDto, newStatus: StatusDto): Promise<void> {
        const items = followerAliases.map((follower) => {
            return {
                [this.followerAliasAttr]: follower,
                [this.posterAliasAttr]: user.alias,
                [this.firstNameAttr]: user.firstName,
                [this.lastNameAttr]: user.lastName,
                [this.imageUrlAttr]: user.imageUrl,
                [this.timestampAttr]: newStatus.timestamp,
                [this.postAttr]: newStatus.post,
            }
        })

        const writeRequests = items.map((item) => ({
            PutRequest: {
                Item: item,
            },
        }));
        
        const params = {
            RequestItems: {
                [this.feedsTableName]: writeRequests,
            },
        };
        await this.client.send(new BatchWriteCommand(params));
    };
}
