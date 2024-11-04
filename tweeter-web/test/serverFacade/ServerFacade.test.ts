import { GetFollowCountRequest, PagedUserItemRequest, RegisterRequest, RegisterResponse } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade"
import "isomorphic-fetch"

describe('serverFacade', () => {
    let serverFacade: ServerFacade;
    const defaultRegisterAlias = "@allen";

    beforeEach(() => {
        serverFacade = new ServerFacade();
    });

    it('can register new user', async () => {
        const registerRequest: RegisterRequest =
            {
                firstName: "me",
                lastName: "me",
                alias: "me",
                password: "pass",
                userImageBytes: "abcdefg",
                imageFileExtension: "jpg"
            };
        const [newUser, authToken] = await serverFacade.register(registerRequest);
        expect(newUser).not.toBeNull();
        expect(newUser.alias).toBe(defaultRegisterAlias);
        expect(authToken).not.toBeNull();
    });

    it('can get followers', async () => {
        const getFollowersRequest: PagedUserItemRequest = {
            token: 'abcdefg',
            userAlias: defaultRegisterAlias,
            pageSize: 10,
            lastItem: null
        }
        const [users, hasMore] = await serverFacade.loadMoreFollowers(getFollowersRequest);
        expect(users).not.toBeNull();
        expect(users.length).toBeGreaterThan(0);
    });

    it('can get followers count', async () => {
        const followersCountRequest: GetFollowCountRequest = {
            token: 'abcdefg',
            user: {
                firstName: 'me',
                lastName: 'me',
                alias: '@me',
                imageUrl: 'google.com'
            }
        }
        const count = await serverFacade.getFollowerCount(followersCountRequest);
        expect(count).toBeGreaterThan(0);
    });
})