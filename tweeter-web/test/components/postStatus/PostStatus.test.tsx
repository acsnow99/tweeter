
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

library.add(fab);

describe('PostStatus component', () => {
    it ('post status and clear buttons are both disabled on initial render', () => {
        const mockPostStatusPresenter = mock<PostStatusPresenter>();
        const mockPostStatusPresenterInstance = instance(mockPostStatusPresenter);

        when(mockPostStatusPresenter.isLoading).thenReturn(false);

        const {postButton, clearButton} = renderPostStatusAndGetElement(() => mockPostStatusPresenterInstance)

        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
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

