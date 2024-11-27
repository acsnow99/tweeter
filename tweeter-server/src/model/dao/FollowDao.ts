import { UserDto } from "tweeter-shared";

export interface FollowDao {
    readonly insertFollowRelationship: (alias: string, toFollowAlias: string, name: string, toFollowName: string) => Promise<void>;
    readonly deleteFollowRelationship: (alias: string, toUnfollowAlias: string) => Promise<void>;
    // returns a list of aliases matching the followers/followees
    readonly getFollowers: (alias: string) => string[];
    readonly getFollowees: (alias: string) => string[];
    readonly getFollowerCount: (alias: string) => number;
    readonly getFolloweeCount: (alias: string) => number;
}
