import { StatusDto } from "tweeter-shared";
import { SQSDao } from "./SQSDao";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class SQSDaoAWS implements SQSDao {
    private client = new SQSClient();
    private url = "https://sqs.us-east-1.amazonaws.com/558044283445/tweeter-post-status-queue";

    public async postStatus(status: StatusDto) {
        const messageBody = JSON.stringify({
            status: status,
        });
        // const reStatus: StatusDto = JSON.parse(messageBody).status;
        // console.log("Getting object back", reStatus.post);

        const params = {
          DelaySeconds: 10,
          MessageBody: messageBody,
          QueueUrl: this.url,
        };
      
        try {
          const data = await this.client.send(new SendMessageCommand(params));
        } catch (err) {
          throw err;
        }
    };
}
