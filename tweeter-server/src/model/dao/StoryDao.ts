import { StatusDto } from "tweeter-shared";
import { UserDto } from "tweeter-shared/src";

export interface StoryDao {
    readonly getStoryPage: (alias: string, lastItem: StatusDto | null, pageSize: number) => Promise<[StatusDto[], boolean]>;
    readonly createStatus: (user: UserDto, newStatus: StatusDto) => Promise<void>;
}
