import { Status, StatusDto, User } from "tweeter-shared";
import { BatchWriteCommand, DynamoDBDocumentClient, PutCommand, QueryCommand, QueryCommandInput } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDto } from "tweeter-shared/src";
import { StoryDao } from "./StoryDao";

export class StoryDaoDynamo implements StoryDao {
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    private readonly statusesTableName = "tweeter-statuses";
    private readonly aliasAttr = "alias";
    private readonly firstNameAttr = "firstName";
    private readonly lastNameAttr = "lastName";
    private readonly imageUrlAttr = "imageUrl";
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
}
