import {
    UserNavigationPresenter,
    UserNavigationView,
} from "../../presenters/UserNavigationPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";

interface UserNavigationListener {
    navigateToUser: (event: React.MouseEvent) => void;
}

const useUserNavigationListener = (): UserNavigationListener => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = useUserInfo();

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        presenter.navigateToUser(
            event.target.toString(),
            authToken!,
            currentUser!
        );
    };

    const listener: UserNavigationView = {
        displayErrorMessage: displayErrorMessage,
        setDisplayedUser: setDisplayedUser,
    };

    const presenter = new UserNavigationPresenter(listener);

    return {
        navigateToUser: navigateToUser,
    };
};

export default useUserNavigationListener;
