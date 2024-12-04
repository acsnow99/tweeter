import { UserDto } from "tweeter-shared";

export interface FollowDao {
    readonly insertFollowRelationship: (alias: string, toFollowAlias: string, name: string, toFollowName: string, imageUrl: string, toFollowImageUrl: string) => Promise<void>;
    readonly deleteFollowRelationship: (alias: string, toUnfollowAlias: string) => Promise<void>;
    // returns a list of aliases matching the followers/followees
    readonly getFollowers: (alias: string, limit?: number, startKey?: { followeeAlias: string; followerAlias: string }) => Promise<string[]>;
    readonly getFollowees: (alias: string) => Promise<string[]>;
    readonly getFollowerCount: (alias: string) => Promise<number>;
    readonly getFolloweeCount: (alias: string) => Promise<number>;
    readonly getIsFollower: (alias: string, toCheckAlias: string) => Promise<boolean>;
}
