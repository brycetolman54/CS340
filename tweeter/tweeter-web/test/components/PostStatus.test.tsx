import { MemoryRouter } from "react-router-dom";
import useUserInfo from "../../src/components/userInfo/UserInfoHook";
import { render, screen } from "@testing-library/react";
import PostStatus from "../../src/components/postStatus/PostStatus";
import React from "react";
import userEvent from "@testing-library/user-event";
import { AuthToken, User } from "tweeter-shared";
import { instance, mock, verify, when } from "@typestrong/ts-mockito";
import "@testing-library/jest-dom";
import { PostStatusPresenter } from "../../src/presenters/PostStatusPresenter";

jest.mock("../../src/components/userInfo/UserInfoHook", () => ({
    ...jest.requireActual("../../src/components/userInfo/UserInfoHook"),
    __esModule: true,
    default: jest.fn(),
}));

describe("Post Status Component", () => {
    let mockUserInstance: User = mock(
        new User("first", "last", "alias", "urlString")
    );
    let mockAuthTokenInstance: AuthToken = mock(
        new AuthToken("token", Date.now())
    );

    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    });

    it("starts with the post status and clear buttons disabled", () => {
        const { postStatusButton, clearButton } = renderAndGetElements();

        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("enables the post status and clear button when the text field has text", async () => {
        const { postStatusButton, clearButton, textField, user } =
            renderAndGetElements();

        await user.type(textField, "a");

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("disables the post status and clear buttons when the text field is cleared", async () => {
        const { postStatusButton, clearButton, textField, user } =
            renderAndGetElements();

        await user.type(textField, "a");

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        await user.clear(textField);

        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("calls the postStatus method with the correct parameters when the post status button is clicked", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        when(mockPresenter.isLoading).thenReturn(false);

        const postText = "postText";
        const { postStatusButton, textField, user } = renderAndGetElements(
            mockPresenterInstance
        );

        await user.type(textField, postText);

        await user.click(postStatusButton);

        verify(
            mockPresenter.submitPost(
                postText,
                mockUserInstance,
                mockAuthTokenInstance
            )
        ).once();
    });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <PostStatus presenter={presenter} />
            ) : (
                <PostStatus />
            )}
        </MemoryRouter>
    );
};

const renderAndGetElements = (presenter?: PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postStatusButton = screen.getByRole("button", {
        name: /Post Status/,
    });
    const clearButton = screen.getByRole("button", { name: /Clear/ });
    const textField = screen.getByLabelText("postText");

    return { postStatusButton, clearButton, textField, user };
};
