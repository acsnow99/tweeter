import { AuthToken, AuthTokenDto, GetUserRequest, GetUserResponse, PagedUserItemRequest, PagedUserItemResponse, User } from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    private SERVER_URL: string = "https://6f2z3a97v2.execute-api.us-east-1.amazonaws.com/dev";
    private communicator: ClientCommunicator;

    public constructor() {
        this.communicator = new ClientCommunicator(this.SERVER_URL);
    }

    public async getUser(request: GetUserRequest): Promise<User> {
        const response = await this.communicator.doPost<
            GetUserRequest, 
            GetUserResponse
        >(request, '/user');

        const userDto = response.user;
        console.log("UserDto from facade", userDto, userDto?.firstName, userDto?.alias);
        const user: User | null = userDto ? new User(userDto.firstName, userDto.lastName, userDto.alias, userDto.imageUrl) : null;
        console.log("User from facade", user);

        if (response.success) {
            if (user === null) {
                throw new Error('No user found');
            } else {
                return user;
            }
        } else {
            console.error(response);
            throw new Error(response.message ? response.message : undefined);
        }
    }

    public async loadMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
        const response = await this.communicator.doPost<
            PagedUserItemRequest, 
            PagedUserItemResponse>
        (request, '/followers');
        
        const items: User[] | null =
        response.success && response.items
            ? response.items.map((dto) => User.fromDto(dto) as User)
            : null;

        if (response.success) {
            if (items == null) {
                throw new Error(`No followers found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ? response.message : undefined);
        }
    }

    public async loadMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
        const response = await this.communicator.doPost<
            PagedUserItemRequest, 
            PagedUserItemResponse>
        (request, '/followees');
        console.log("Called followees");
        
        const items: User[] | null =
        response.success && response.items
            ? response.items.map((dto) => User.fromDto(dto) as User)
            : null;

        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message ? response.message : undefined);
        }
    }
}

// const authTokenDto: AuthTokenDto = {
//     token: authToken.token,
//     timestamp: authToken.timestamp
// }
// const request: GetUserRequest = {
//     authToken: authTokenDto,
//     alias
// }
