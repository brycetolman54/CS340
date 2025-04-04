import { DynamoFactory } from "./model/daos/DynamoDB/DynamoFactory";
import { FollowService } from "./model/service/FollowService";
import { UserService } from "./model/service/UserService";

async function Main() {
    const factory = new DynamoFactory();
    const userService = new UserService(factory);
    const followService = new FollowService(factory);
    try {
        const [user, token] = await userService.login("bryce", "hellopickle");
        const follower = await userService.getIsFollowerStatus(
            token.token,
            { firstName: "", lastName: "", alias: "buddy", imageUrl: "" },
            { firstName: "", lastName: "", alias: "bryce", imageUrl: "" }
        );
        console.log("follower? ", follower);
        await userService.logout(token.token);
    } catch (error) {
        console.log("You got an error pickle: ", (error as Error).message);
    }
}

Main();
