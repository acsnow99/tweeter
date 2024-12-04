import { StatusDto } from "tweeter-shared";
import { getStatusService } from "../utils";

export const handler = async function (event: any) {
    const service = getStatusService();
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        const status: StatusDto = JSON.parse(body).status;
        await service.sendMessagePostToFeed(status);
    }
    return null;
};