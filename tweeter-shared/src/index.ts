// domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// dto's
export type { UserDto } from './model/dto/UserDto';
export type { AuthTokenDto } from './model/dto/AuthTokenDto';
export type { PostSegmentDto } from './model/dto/PostSegmentDto';
export type { StatusDto } from './model/dto/StatusDto';

// request types
export type { TweeterRequest } from './model/net/request/TweeterRequest';
export type { PagedUserItemRequest } from './model/net/request/PagedUserItemRequest';
export type { LoginRequest } from './model/net/request/LoginRequest';
export type { LogoutRequest } from './model/net/request/LogoutRequest';
export type { RegisterRequest } from './model/net/request/RegisterRequest';
export type { GetIsFollowerStatusRequest } from './model/net/request/GetIsFollowerStatusRequest';
export type { GetFollowCountRequest } from './model/net/request/GetFollowCountRequest';
export type { GetUserRequest } from './model/net/request/GetUserRequest';
export type { FollowRequest } from './model/net/request/FollowRequest';
export type { StatusRequest } from './model/net/request/StatusRequest';
export type { PostStatusRequest } from './model/net/request/PostStatusRequest';

// response types
export type { TweeterResponse } from './model/net/response/TweeterResponse';
export type { PagedUserItemResponse } from './model/net/response/PagedUserItemResponse';
export type { LoginResponse } from './model/net/response/LoginResponse';
export type { LogoutResponse } from './model/net/response/LogoutResponse';
export type { RegisterResponse } from './model/net/response/RegisterResponse';
export type { GetFollowCountResponse } from './model/net/response/GetFollowCountResponse';
export type { GetIsFollowerStatusResponse } from './model/net/response/GetIsFollowerStatusResponse';
export type { GetUserResponse } from './model/net/response/GetUserResponse';
export type { FollowResponse } from './model/net/response/FollowResponse';
export type { StatusResponse } from './model/net/response/StatusResponse';
export type { PostStatusResponse } from './model/net/response/PostStatusResponse';

// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";
