import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserHook";
import { UserNavigationPresenter } from "../../presenters/UserNavigationPresenter";

interface UserNavigationListener {
    navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigationListener = (): UserNavigationListener => {
    const { setDisplayedUser, currentUser, authToken } =
        useUserInfo();
    const { displayErrorMessage } = useToastListener();

    const view = {
      setDisplayedUser: setDisplayedUser,
      displayErrorMessage: displayErrorMessage,
    }
    const userPresenter = new UserNavigationPresenter(view);

    const navigateToUser = (event: React.MouseEvent) => userPresenter.navigateToUser(authToken, currentUser, event);

    return { navigateToUser };
}

export default useUserNavigationListener;
