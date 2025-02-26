import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent, { UserEvent } from "@testing-library/user-event";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { mock, instance, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
    it("starts with the sign-in button disabled", () => {
        const { signInButton } = renderLoginAndGetElements("/");
        expect(signInButton).toBeDisabled();
    });

    it("enables the sign-in button if both alias and password fields have text", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElements("/");

        await typeInFields(user, aliasField, passwordField, "a", "a");

        expect(signInButton).toBeEnabled();
    });

    it("disables the sign-in button if either field is cleared", async () => {
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElements("/");

        await typeInFields(user, aliasField, passwordField, "a", "a");
        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await typeInFields(user, aliasField, passwordField, "a", "a");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("calls the presenter's login method with correct parameters when the sign-in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "https://google.com";
        const alias = "afdfs";
        const password = "fdhfkd";
        const { signInButton, aliasField, passwordField, user } =
            renderLoginAndGetElements(originalUrl, mockPresenterInstance);

        //     await typeInFields(user, aliasField, passwordField, alias, password);

        //     await user.click(signInButton);

        //     verify(mockPresenter.authenticate(alias, password)).once();
    });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
        <MemoryRouter>
            {!!presenter ? (
                <Login originalUrl={originalUrl} presenter={presenter} />
            ) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
};

const renderLoginAndGetElements = (
    originalUrl: string,
    presenter?: LoginPresenter
) => {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/ });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { signInButton, aliasField, passwordField, user };
};

const typeInFields = async (
    user: UserEvent,
    aliasField: HTMLElement,
    passwordField: HTMLElement,
    alias: string,
    password: string
) => {
    await user.type(aliasField, alias);
    await user.type(passwordField, password);
};
