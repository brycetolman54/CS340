import { AuthToken, Status } from "tweeter-shared";
import { StatusService } from "../../src/model/services/StatusService";
import "isomorphic-fetch";

describe("StatusService", () => {
    it("retrieves a user's story correctly", async () => {
        const statusService = new StatusService();

        const [items, hasMore] = await statusService.loadMoreStoryItems(
            new AuthToken("token", 10),
            "@alias",
            5,
            null
        );

        // check for expectations
        expect(hasMore).toBe(true);
        expect(items.length).toBe(5);
        expect(items[0]).toBeInstanceOf(Status);
    });
});
