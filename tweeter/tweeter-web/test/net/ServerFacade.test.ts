import { AuthToken, User } from "tweeter-shared";
import { ServerFacade } from "../../src/net/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {
    const serverFacade = new ServerFacade();

    it("calls register correctly in the server", async () => {
        const [user, token] = await serverFacade.register({
            firstName: "bryce",
            lastName: "tolman",
            alias: "@bryce",
            password: "pwd",
            imageStringBase64: "imageString",
            imageFileExtension: ".jpg",
        });

        // just test that the right type of thing is passed back
        expect(user).toBeInstanceOf(User);
        expect(token).toBeInstanceOf(AuthToken);
    });

    it("calls getFollowers correctly on the server", async () => {
        const [items, hasMore] = await serverFacade.getMoreFollowers({
            token: "token",
            userAlias: "@allen",
            pageSize: 10,
            lastItem: null,
        });

        // make sure we got back what we expected
        expect(hasMore).toBe(true);
        expect(items.length).toBe(10);
        expect(items[0]).toBeInstanceOf(User);
    });

    it("calls getFollowerCount correctly on the server", async () => {
        const count = await serverFacade.getFollowerCount({
            token: "token",
            user: new User("a", "b", "c", "d").dto,
        });

        // make sure we get back a count
        expect(count).toBeGreaterThanOrEqual(0);
    });
});
