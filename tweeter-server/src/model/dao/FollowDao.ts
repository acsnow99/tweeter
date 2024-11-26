import { UserDto } from "tweeter-shared";

interface FollowDao {
    readonly insertFollowRelationship: (alias: string, toFollowAlias: string) => void;
    readonly deleteFollowRelationship: (alias: string, toUnfollowAlias: string) => void;
    readonly getFollowers: (alias: string) => UserDto[];
    readonly getFollowees: (alias: string) => UserDto[];
    readonly getFollowerCount: (alias: string) => number;
    readonly getFolloweeCount: (alias: string) => string;
}
