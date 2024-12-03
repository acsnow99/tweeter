import { StatusDto } from "tweeter-shared";
import { UserDto } from "tweeter-shared/src";

export interface FeedDao {
    readonly getFeedPage: (alias: string, lastItem: StatusDto | null, pageSize: number) => Promise<[StatusDto[], boolean]>;
    readonly createFeedItems: (followerAliases: string[], user: UserDto, newStatus: StatusDto) => Promise<void>;
}
