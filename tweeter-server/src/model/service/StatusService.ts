import { FakeData, Status, StatusDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/dist/model/dto/AuthTokenDto";

export class StatusService {
    public async loadMoreStoryItems(
        authToken: AuthTokenDto,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    };
    
    public async loadMoreFeedItems(
        authToken: AuthTokenDto,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    };

    public async postStatus(
        authToken: AuthTokenDto,
        newStatus: StatusDto
    ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
    };
}
