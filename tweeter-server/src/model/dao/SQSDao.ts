import { StatusDto } from "tweeter-shared";

export interface SQSDao {
    readonly postStatus: (status: StatusDto) => Promise<void>;
    readonly postToFeed: (status: StatusDto, followers: string[]) => Promise<void>;
}