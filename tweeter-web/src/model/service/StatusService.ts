import { AuthToken, FakeData, PostSegmentDto, PostStatusRequest, Status, StatusRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const request: StatusRequest = {
            authToken: {
                token: authToken.token,
                timestamp: authToken.timestamp
            },
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null
        };
        return await this.serverFacade.loadMoreStoryItems(request);
    };
    
    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const request: StatusRequest = {
            authToken: {
                token: authToken.token,
                timestamp: authToken.timestamp
            },
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null
        };
        return await this.serverFacade.loadMoreFeedItems(request);
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<void> {
        const request: PostStatusRequest = {
            authToken: {
                token: authToken.token,
                timestamp: authToken.timestamp
            },
            newStatus: newStatus.dto
        };
        await this.serverFacade.postStatus(request);
    };
}
