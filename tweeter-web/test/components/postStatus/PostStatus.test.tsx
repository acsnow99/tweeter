
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify, when } from "ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus"
import { PostStatusPresenter, PostStatusView } from "../../../src/presenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userNavigation/UserHook";

library.add(fab);

jest.mock("../../../src/components/userNavigation/UserHook", () => ({
    ...jest.requireActual("../../../src/components/userNavigation/UserHook"),
    __esModule: true,
    default: jest.fn(),
}));      
        

describe('PostStatus component', () => {
    const mockPostStatusPresenter = mock<PostStatusPresenter>();
    const mockPostStatusPresenterInstance = instance(mockPostStatusPresenter);

    beforeAll(() => {
        const mockUserInstance = instance(mock<User>());
        const mockAuthTokenInstance = instance(mock<AuthToken>());
        (useUserInfo as jest.Mock).mockReturnValue({
            currentUser: mockUserInstance,
            authToken: mockAuthTokenInstance,
        });
    })

    it ('post status and clear buttons are both disabled on initial render', () => {
        console.log('First test');
        when(mockPostStatusPresenter.isLoading).thenReturn(false);

        const {postButton, clearButton} = renderPostStatusAndGetElement(() => mockPostStatusPresenterInstance)

        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it ('post status and clear buttons are both enabled after text is typed', async () => {
        console.log("second test");
        when(mockPostStatusPresenter.isLoading).thenReturn(false);

        const {postButton, clearButton, textField, user} = renderPostStatusAndGetElement(() => mockPostStatusPresenterInstance)

        await user.type(textField, "What a post!");

        expect(postButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });
});

const renderPostStatusComponent = (generatePresenter: (view: PostStatusView) => PostStatusPresenter) => {
    return render(
    <MemoryRouter>
        <PostStatus generatePresenter={generatePresenter} />
    </MemoryRouter>)
};

const renderPostStatusAndGetElement = (generatePresenter: (view: PostStatusView) => PostStatusPresenter) => {
    const user = userEvent.setup();

    renderPostStatusComponent(generatePresenter);

    const postButton = screen.getByRole("button", { name: /Post Status/i });
    const clearButton = screen.getByRole("button", { name: /Clear/i });

    const textField = screen.getByLabelText("postTextField");

    return { postButton, clearButton, textField, user };
};

