
import { instance, mock, spy, verify, when } from 'ts-mockito';
import { StatusService } from '../../src/model/service/StatusService';
import { PostStatusView, PostStatusPresenter } from '../../src/presenters/PostStatusPresenter';
import React from 'react';
import { AuthToken, User } from 'tweeter-shared';


describe('PostStatusPresenter', () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;
    const authToken = new AuthToken('whattheheck', Date.now());
    const user = new User('me', 'meington', 'me', 'nothing');
    const mouseEvent = { preventDefault: () => {} };

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
    });

    it('tells the view to display a posting status message', async () => {
        await postStatusPresenter.submitPost((mouseEvent as React.MouseEvent), authToken, user);
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    });
});
