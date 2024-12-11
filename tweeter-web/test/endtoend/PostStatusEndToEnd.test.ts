
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';
import { StatusService } from '../../src/model/service/StatusService';
import { PostStatusView, PostStatusPresenter } from '../../src/presenters/PostStatusPresenter';
import { LoginView, LoginPresenter } from '../../src/presenters/LoginPresenter';
import { UserService } from '../../src/model/service/UserService';
import React from 'react';
import { AuthToken, Status, User } from 'tweeter-shared';
import 'isomorphic-fetch';
import { ServerFacade } from '../../src/network/ServerFacade';


describe('PostStatusPresenter', () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;
    let authToken: AuthToken;
    let mockLoginView: LoginView;
    const user = new User('Daisy', 'Duck', '@daisy', 'https://cs340tweeter-images.s3.us-east-1.amazonaws.com/image/%40daisy');
    let outputUser: User;
    const mouseEvent = { preventDefault: () => {} };
    const post = "Test post!";
    const status = new Status(post, user, Date.now());

    beforeAll(async () => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);
        [outputUser, authToken] = await (new UserService()).login('@daisy', 'pass');
    });

    /*
        The presenter tells the view to display a posting status message.
        The presenter calls postStatus on the post status service with the correct status string and auth token.
        When posting of the status is successful, the presenter tells the view to clear the last info message, clear the post, and display a status posted message.
        When posting of the status is not successful, the presenter tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message.
    */

    it('tells the view to display a posting status message', async () => {
        await postStatusPresenter.submitPost(post, (mouseEvent as React.MouseEvent), authToken, outputUser);
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
        const statusResult = await (new ServerFacade()).loadMoreStoryItems({
            authToken: {token: authToken.token, timestamp: authToken.timestamp},
            userAlias: outputUser.alias,
            pageSize: 1,
            lastItem: null
        });
        expect(statusResult[0][0].post).toBe(post);
    });
});
