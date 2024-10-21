import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { instance, mock, verify, when } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
    it ('starts with the sign-in button disabled', () => {
        const { signInButton } = renderLoginAndGetElement("/");
        expect(signInButton).toBeDisabled();
    });

    it ('enables sign-in button if alias and password fields are filled', async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");
        await user.type(aliasField, "me");
        await user.type(passwordField, "password");

        expect(signInButton).toBeEnabled();
    });

    it ('disableds sign-in button if alias or password field is cleared', async () => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");
        await user.type(aliasField, "me");
        await user.type(passwordField, "password");

        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();
        await user.type(aliasField, "me");
        expect(signInButton).toBeEnabled();
        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it ('calls presenter/s login method with correct parameters when button is pressed', async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const url = "/";

        when(mockPresenter.isLoading).thenReturn(false);

        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(url, mockPresenterInstance);

        const alias = "me";
        const password = "password";

        await user.type(aliasField, alias);
        await user.type(passwordField, password);
        await user.click(signInButton);
        verify(mockPresenter.doLogin(alias, password, url, false)).once();
    });
});

const renderLoginComponent = (originalUrl: string, presenter?: LoginPresenter) => {
    return render(
    <MemoryRouter>
        {!!presenter ?
            <Login originalUrl={originalUrl} loginPresenter={presenter} />
                : <Login originalUrl={originalUrl} />
        }
    </MemoryRouter>)
};

const renderLoginAndGetElement = (originalUrl: string, presenter?: LoginPresenter) => {
    const user = userEvent.setup();

    renderLoginComponent(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { signInButton, aliasField, passwordField, user };
};
