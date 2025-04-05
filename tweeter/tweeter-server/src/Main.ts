import { DynamoFactory } from "./model/daos/DynamoDB/DynamoFactory";
import { FollowService } from "./model/service/FollowService";
import { StatusService } from "./model/service/StatusService";
import { UserService } from "./model/service/UserService";

async function Main() {
    const factory = new DynamoFactory();
    const userService = new UserService(factory);
    const followService = new FollowService(factory);
    const statusService = new StatusService(factory);
    try {
        const [user, token] = await userService.login("you", "asdf");
        console.log(token.token);
        await userService.logout(token.token);
    } catch (error) {
        console.log("You got an error pickle: ", (error as Error).message);
    }
}

Main();
