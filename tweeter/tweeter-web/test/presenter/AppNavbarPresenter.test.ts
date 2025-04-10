import { AuthToken } from "tweeter-shared";
import {
    AppNavbarPresenter,
    AppNavbarView,
} from "../../src/presenters/AppNavbarPresenter";
import {
    anything,
    instance,
    mock,
    spy,
    verify,
    when,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/model/UserService";

describe("AppNavbarPresenter", () => {
    let mockAppNavbarView: AppNavbarView;
    let appNavbarPresenter: AppNavbarPresenter;
    let mockUserService: UserService;

    const authToken = new AuthToken("abcdef", Date.now());

    beforeEach(() => {
        mockAppNavbarView = mock<AppNavbarView>();
        const mockAppNavbarViewInstance = instance(mockAppNavbarView);

        const appNavbarPresenterSpy: AppNavbarPresenter = spy(
            new AppNavbarPresenter(mockAppNavbarViewInstance)
        );
        appNavbarPresenter = instance(appNavbarPresenterSpy);

        mockUserService = mock<UserService>();
        const mockUserServiceInstance = instance(mockUserService);

        when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
    });

    it("tells the view to display a logging out message", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(
            mockAppNavbarView.displayInfoMessage("Logging Out...", 0)
        ).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavbarPresenter.logout(authToken);
        verify(mockUserService.logout(authToken)).once();

        // let [capturedToken] = capture(mockUserService.logout).last();
        // expect(capturedToken).toEqual(authToken);
    });

    it("tells the view to clear the last info message, clear the user info, and navigate to the login page when logout is successful", async () => {
        await appNavbarPresenter.logout(authToken);

        verify(mockAppNavbarView.clearLastInfoMessage()).once();
        verify(mockAppNavbarView.clearUserInfo()).once();
        verify(mockAppNavbarView.displayErrorMessage(anything())).never();
    });

    it("tells the view to display an error message and does not tell it to clear the last info message or clear the user info when logout is unsucessful", async () => {
        const error = new Error("Logout Failed");
        when(mockUserService.logout(anything())).thenThrow(error);

        await appNavbarPresenter.logout(authToken);

        verify(
            mockAppNavbarView.displayErrorMessage(
                "Failed to log user out because of exception: Logout Failed"
            )
        ).once();
        verify(mockAppNavbarView.clearLastInfoMessage()).never();
        verify(mockAppNavbarView.clearUserInfo()).never();
    });
});
