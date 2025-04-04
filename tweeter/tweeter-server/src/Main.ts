import { DynamoFactory } from "./model/daos/DynamoDB/DynamoFactory";
import { UserService } from "./model/service/UserService";

async function Main() {
    const factory = new DynamoFactory();
    const userService = new UserService(factory);
    const authDao = factory.getAuthorizationDAO();
    try {
        // const [rUser, rToken] = await userService.register(
        //     "bryce",
        //     "tolman",
        //     "bryce",
        //     "hellopickle",
        //     "image",
        //     "jpg"
        // );
        // await userService.logout(rToken.token);

        const [user, token] = await userService.login("bryce", "hellopickle");
        console.log("token: ", token.token);
        const followers = await userService.getFollowCount(
            token.token,
            {
                firstName: user.firstName,
                lastName: user.lastName,
                alias: user.alias,
                imageUrl: user.imageUrl,
            },
            true
        );
        console.log("followers: " + followers);
        await userService.logout(token.token);
    } catch (error) {
        console.log("You got an error pickle: ", (error as Error).message);
    }
}

Main();
