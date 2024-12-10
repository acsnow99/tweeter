import { StatusDto } from "tweeter-shared";
import { SQSDao } from "./SQSDao";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SQSDaoAWS implements SQSDao {
    private client = new SQSClient();
    private statusUrl = "https://sqs.us-east-1.amazonaws.com/558044283445/tweeter-post-status-queue";
    private feedUrl = "";

    public async postStatus(status: StatusDto) {
        const messageBody = JSON.stringify({
            status: status,
        });
        this.sendMessage(messageBody, this.statusUrl);
    };

    public async postToFeed(status: StatusDto, followers: string[]) {
        const messageBody = JSON.stringify({
            status: status,
            followers: followers,
        });
        this.sendMessage(messageBody, this.feedUrl);
    };

    private async sendMessage(body: string, url: string) {
        const params = {
            DelaySeconds: 10,
            MessageBody: body,
            QueueUrl: url,
          };
        
          try {
            const data = await this.client.send(new SendMessageCommand(params));
          } catch (err) {
            throw err;
          }
    };
}
