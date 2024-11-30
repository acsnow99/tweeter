import { StatusDto } from "tweeter-shared";
import { UserDto } from "tweeter-shared/src";

export interface StatusDao {
    readonly getStoryPage: (alias: string, lastItem: StatusDto | null, pageSize: number) => Promise<[StatusDto[], boolean]>;
    readonly getFeedPage: (alias: string, lastItem: StatusDto | null, pageSize: number) => Promise<[StatusDto[], boolean]>;
    readonly createStatus: (user: UserDto, newStatus: StatusDto) => Promise<void>;
    readonly createFeedItems: (followerAliases: string[], user: UserDto, newStatus: StatusDto) => Promise<void>;
}
