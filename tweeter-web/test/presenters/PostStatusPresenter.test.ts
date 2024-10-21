
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';
import { StatusService } from '../../src/model/service/StatusService';
import { PostStatusView, PostStatusPresenter } from '../../src/presenters/PostStatusPresenter';
import React from 'react';
import { AuthToken, Status, User } from 'tweeter-shared';


describe('PostStatusPresenter', () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;
    const authToken = new AuthToken('whattheheck', Date.now());
    const user = new User('me', 'meington', 'me', 'nothing');
    const mouseEvent = { preventDefault: () => {} };
    const post = "Test post!";
    const status = new Status(post, user, Date.now());

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
    });

    /*
        The presenter tells the view to display a posting status message.
        The presenter calls postStatus on the post status service with the correct status string and auth token.
        When posting of the status is successful, the presenter tells the view to clear the last info message, clear the post, and display a status posted message.
        When posting of the status is not successful, the presenter tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message.
    */

    it('tells the view to display a posting status message', async () => {
        await postStatusPresenter.submitPost(post, (mouseEvent as React.MouseEvent), authToken, user);
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    });

    it('calls postStatus on the post status service with the correct status string and token', async () => {
        await postStatusPresenter.submitPost(post, (mouseEvent as React.MouseEvent), authToken, user);
        verify(mockStatusService.postStatus(authToken, anything())).once();

        let [capturedAuthToken, capturedStatus] = capture(mockStatusService.postStatus).last();
        expect(capturedStatus.post).toEqual(post);
    });

    it('tells view to clear info message, clear post, and display status posted message if successful', async () => {
        await postStatusPresenter.submitPost(post, (mouseEvent as React.MouseEvent), authToken, user);
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
    });

    it('tells view to display error message, clears last info message, and does not clear the post or display status message if unsuccessful', async () => {
        const error = new Error('An error occurred when posting');
        when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);
        await postStatusPresenter.submitPost(post, (mouseEvent as React.MouseEvent), authToken, user);

        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.displayErrorMessage(`Failed to post the status because of exception: ${error.message}`)).once();
        verify(mockPostStatusView.setPost("")).never();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
    });
});
