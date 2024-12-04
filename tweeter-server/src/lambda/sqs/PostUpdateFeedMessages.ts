import { StatusDto } from "tweeter-shared";
import { getStatusService } from "../utils";

export const handler = async function (event: any) {
    for (let i = 0; i < event.Records.length; ++i) {
        const { body } = event.Records[i];
        const status: StatusDto = JSON.parse(body).status;
        const service = getStatusService();
        await service.postToFeed(status);
    }
    return null;
};