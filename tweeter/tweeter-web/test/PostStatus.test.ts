import { ServerFacade } from "../src/net/ServerFacade";
import {
    PostStatusPresenter,
    PostStatusView,
} from "../src/presenters/PostStatusPresenter";
import { instance, mock, spy, verify } from "@typestrong/ts-mockito";
import "isomorphic-fetch";

describe("Post Status Round Trip", () => {
    const server = new ServerFacade();
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;

    const alias = "a";
    const password = "asdf";

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusInstance = instance(mockPostStatusView);

        const PostStatusPresenterSpy: PostStatusPresenter = spy(
            new PostStatusPresenter(mockPostStatusInstance)
        );
        postStatusPresenter = instance(PostStatusPresenterSpy);
    });

    it("Works", async () => {
        const [user, token] = await server.login({
            alias: alias,
            password: password,
        });

        const time = Date.now();

        await postStatusPresenter.submitPost(
            "testing post" + time,
            user,
            token
        );

        await new Promise((resolve) => setTimeout(resolve, 2000));

        verify(
            mockPostStatusView.displayInfoMessage("Status posted!", 2000)
        ).once();

        const [story, hasMore] = await server.getMoreStoryItems({
            token: token.token,
            userAlias: user.alias,
            pageSize: 10,
            lastItem: null,
        });

        expect(story[0].post).toEqual("testing post" + time);
    }, 100000);
});
