import {
    anything,
    capture,
    instance,
    mock,
    spy,
    verify,
    when,
} from "@typestrong/ts-mockito";
import {
    PostStatusPresenter,
    PostStatusView,
} from "../../src/presenters/PostStatusPresenter";
import { StatusService } from "../../src/model/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockStatusService: StatusService;
    const post: string = "posting...";

    const authToken: AuthToken = new AuthToken("abcdef", Date.now());
    const user: User = new User("first", "last", "alias", "imgUrl");

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusInstance = instance(mockPostStatusView);

        const PostStatusPresenterSpy: PostStatusPresenter = spy(
            new PostStatusPresenter(mockPostStatusInstance)
        );
        postStatusPresenter = instance(PostStatusPresenterSpy);

        mockStatusService = mock<StatusService>();
        const mockStatusServiceInstance = instance(mockStatusService);

        when(PostStatusPresenterSpy.service).thenReturn(
            mockStatusServiceInstance
        );
    });

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(post, user, authToken);
        verify(
            mockPostStatusView.displayInfoMessage("Posting status...", 0)
        ).once();
    });

    it("calls postStatus on the status service with the correct status and auth token", async () => {
        await postStatusPresenter.submitPost(post, user, authToken);
        verify(mockStatusService.postStatus(authToken, anything())).once();

        let [_, capturedStatus] = capture(mockStatusService.postStatus).last();
        expect(capturedStatus.post).toEqual(post);
    });

    it("tells the view to clear the last info message, clear the post, and display a status posted message when post is successful", async () => {
        await postStatusPresenter.submitPost(post, user, authToken);

        verify(mockStatusService.postStatus(anything(), anything())).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();
        verify(mockPostStatusView.setPostEmpty()).once();
        verify(
            mockPostStatusView.displayInfoMessage("Posting status...", 0)
        ).once();
        verify(
            mockPostStatusView.displayInfoMessage("Status posted!", 2000)
        ).once();
    });

    it("tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when post is unsuccessful", async () => {
        const error = new Error("Post Status Failed");
        when(mockStatusService.postStatus(anything(), anything())).thenThrow(
            error
        );

        await postStatusPresenter.submitPost(post, user, authToken);

        verify(
            mockPostStatusView.displayErrorMessage(
                "Failed to post the status because of exception: Post Status Failed"
            )
        ).once();
        verify(mockPostStatusView.clearLastInfoMessage()).once();

        verify(
            mockPostStatusView.displayInfoMessage("Status posted!", 2000)
        ).never();
        verify(mockPostStatusView.setPostEmpty()).never();
    });
});
