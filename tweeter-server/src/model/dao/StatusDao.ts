import { StatusDto } from "tweeter-shared";
import { UserDto } from "tweeter-shared/src";

export interface StatusDao {
    readonly getStoryPage: (alias: string, lastItem: StatusDto, pageSize: number) => Promise<[StatusDao[], boolean]>;
    readonly getFeedPage: (alias: string, lastItem: StatusDto, pageSize: number) => Promise<[StatusDao[], boolean]>;
    readonly createStatus: (user: UserDto, newStatus: StatusDto) => Promise<void>;
    readonly createFeedItems: (followerAliases: string[], user: UserDto, newStatus: StatusDto) => Promise<void>;
}
