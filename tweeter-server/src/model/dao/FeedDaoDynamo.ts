import { Status, StatusDto, User } from "tweeter-shared";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared/src";
import { FeedDao } from "./FeedDao";

export class FeedDaoDynamo implements FeedDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly feedsTableName = "tweeter-feeds";
    private readonly posterAliasAttr = "posterAlias";
    private readonly firstNameAttr = "firstName";
    private readonly lastNameAttr = "lastName";
    private readonly imageUrlAttr = "imageUrl";
    private readonly followerAliasAttr = "followerAlias"
    private readonly timestampAttr = "timestamp";
    private readonly postAttr = "post";

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
