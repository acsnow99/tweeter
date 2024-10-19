
import { AuthToken } from 'tweeter-shared';
import { NavBarPresenter, NavBarView } from '../../src/presenters/NavBarPresenter';
import { anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';
import { UserService } from '../../src/model/service/UserService';

describe('NavBarPresenter', () => {
    let mockNavBarPresenterView: NavBarView;
    let navBarPresenter: NavBarPresenter;
    let mockUserService: UserService;
    const authToken = new AuthToken('whattheheck', Date.now());

    beforeEach(() => {
        mockNavBarPresenterView = mock<NavBarView>();
        const mockNavBarPresenterViewInstance = instance(mockNavBarPresenterView);

        const NavBarPresenterSpy = spy(new NavBarPresenter(mockNavBarPresenterViewInstance));
        navBarPresenter = instance(NavBarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(NavBarPresenterSpy.service).thenReturn(mockUserServiceInstance);
    });

    it('tells view to display logging out message', async () => {
        await navBarPresenter.logOut(authToken);
        verify(mockNavBarPresenterView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await navBarPresenter.logOut(authToken);
        verify(mockUserService.logout(authToken)).once();

        // let [capturedAuthToken] = capture(mockUserService.logout).last();
        // expect(capturedAuthToken).toEqual(authToken);
    });

    it('tells the view to clear the last info message and clear the user info when logout successful', async () => {
        await navBarPresenter.logOut(authToken);
        verify(mockNavBarPresenterView.clearLastInfoMessage()).once();
        verify(mockNavBarPresenterView.clearUserInfo()).once();

        verify(mockNavBarPresenterView.displayErrorMessage(anything())).never();
    });

    it('displays an error message and does not clear the last info message or clear the user info when logout fails', async () => {
        const error = new Error('An error occurred when loggin out');
        when(mockUserService.logout(authToken)).thenThrow(error);
        await navBarPresenter.logOut(authToken);

        verify(mockNavBarPresenterView.displayErrorMessage(`Failed to log user out because of exception: An error occurred when loggin out`)).once();

        verify(mockNavBarPresenterView.clearLastInfoMessage()).never();
        verify(mockNavBarPresenterView.clearUserInfo()).never();
    });
});
