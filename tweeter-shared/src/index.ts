// domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// dto's
export type { UserDto } from './model/dto/UserDto';

// request types
export type { PagedUserItemRequest } from './model/net/request/PagedUserItemRequest';
export type { LoginRequest } from './model/net/request/LoginRequest';
export type { LogoutRequest } from './model/net/request/LogoutRequest';
export type { RegisterRequest } from './model/net/request/RegisterRequest';

// response types
export type { PagedUserItemResponse } from './model/net/response/PagedUserItemResponse';
export type { LoginResponse } from './model/net/response/LoginResponse';
export type { RegisterResponse } from './model/net/response/RegisterResponse';


// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";
