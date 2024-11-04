import { AuthToken } from 'tweeter-shared';
import { StatusService } from 'tweeter-web/src/model/service/StatusService'
import "isomorphic-fetch"

describe('StatusService', () => {
    const statusService = new StatusService();

    it('can get a users story items', async () => {
        const authToken = new AuthToken('abcdefg', 3);
        const [statuses, hasMore] = await statusService.loadMoreStoryItems(authToken, '@me', 10, null);
        expect(statuses).not.toBeNull();
        expect(statuses.length).toBeGreaterThan(0);
    })
})