import { FollowDAO } from "../FollowDAO";

export class DynamoFollowDAO implements FollowDAO {
    // todoimport { Follow } from "./entity/Follow";
    // import { FollowDAO } from "./dao/FollowDAO";
    // import { DataPage } from "./entity/DataPage";
    // class OldMain {
    //     async run() {
    //         const followDAO = new FollowDAO();
    //         const oneFollow = new Follow("@bryce", "bryce", "@rylie", "rylie");
    //         const followKeys = new Follow("@bryce", "", "@rylie", "");
    //         const twoFollow = new Follow("@bryce", "Bryce", "@rylie", "Rylie");
    //         await followDAO.putFollow(oneFollow);
    //         let follow: Follow | undefined = await followDAO.getFollow(followKeys);
    //         if (!(follow instanceof Follow)) {
    //             console.log("follow is not of type Follow");
    //             return 0;
    //         } else {
    //             console.log("Got: ", follow.toString());
    //         }
    //         await followDAO.updateFollow(twoFollow);
    //         let follow2: Follow | undefined = await followDAO.getFollow(followKeys);
    //         if (!(follow2 instanceof Follow)) {
    //             console.log("follow is not of type Follow");
    //             return 0;
    //         } else {
    //             console.log("Got: ", follow2.toString());
    //         }
    //         await followDAO.deleteFollow(oneFollow);
    //         let undef: Follow | undefined = await followDAO.getFollow(followKeys);
    //         if (typeof undef != "undefined") {
    //             console.log("follow is not of type undefined");
    //             return 0;
    //         } else {
    //             console.log("Got: undefined");
    //         }
    //     }
    // }
    // class Main {
    //     async run() {
    //         const followDAO = new FollowDAO();
    //         const followKey = new Follow("@bryce", "", "@rylie", "");
    //         const updateFollow = new Follow("@bryce", "BRYCE", "@rylie", "RYLIE");
    //         const followers = [
    //             "abe",
    //             "ben",
    //             "cade",
    //             "derick",
    //             "edgar",
    //             "frank",
    //             "gerald",
    //             "henry",
    //             "isaac",
    //             "john",
    //             "kim",
    //             "lucy",
    //             "mary",
    //             "nick",
    //             "oswald",
    //             "patty",
    //             "quinn",
    //             "rick",
    //             "steven",
    //             "tristan",
    //             "ursula",
    //             "vick",
    //             "wendy",
    //             "xavier",
    //             "zane",
    //         ];
    //         const followees = [
    //             "andy",
    //             "briton",
    //             "carol",
    //             "denise",
    //             "eve",
    //             "francine",
    //             "gary",
    //             "harry",
    //             "irene",
    //             "judy",
    //             "kris",
    //             "lowell",
    //             "maurice",
    //             "nicholas",
    //             "oscar",
    //             "perry",
    //             "qi",
    //             "rylie",
    //             "sophie",
    //             "tali",
    //             "uncle",
    //             "victor",
    //             "west",
    //             "yulesy",
    //             "zion",
    //         ];
    //         // put 25 followers (same followee)
    //         console.log("Posting 25 Followers:\n");
    //         followers.forEach(async (follower) => {
    //             await followDAO.putFollow(
    //                 new Follow("@" + follower, follower, "@tolman", "tolman")
    //             );
    //         });
    //         // put 25 followees (same follower)
    //         console.log("Posting 25 Followees:\n");
    //         followees.forEach(async (followee) => {
    //             await followDAO.putFollow(
    //                 new Follow("@bryce", "bryce", "@" + followee, followee)
    //             );
    //         });
    //         // get one item
    //         console.log("Getting item:");
    //         let follow = await followDAO.getFollow(followKey);
    //         if (!(follow instanceof Follow)) {
    //             console.log("follow is not of instance follow");
    //             return 0;
    //         } else {
    //             console.log("  Got: ", follow.toString(), "\n");
    //         }
    //         // update one item
    //         console.log("Updating item:");
    //         await followDAO.updateFollow(updateFollow);
    //         follow = await followDAO.getFollow(followKey);
    //         if (!(follow instanceof Follow)) {
    //             console.log("follow is not of instance follow");
    //             return 0;
    //         } else {
    //             console.log("  Got: ", follow.toString(), "\n");
    //         }
    //         // delete one item
    //         console.log("Deleting item:");
    //         await followDAO.deleteFollow(updateFollow);
    //         follow = await followDAO.getFollow(followKey);
    //         if (typeof follow != "undefined") {
    //             console.log("follow is not undefined");
    //             return 0;
    //         } else {
    //             console.log("  Got: undefined\n");
    //         }
    //         // get 2 pages of followees
    //         console.log("Getting Followees: ");
    //         let page: DataPage<Follow> = await followDAO.getPageOfFollowees(
    //             "@bryce"
    //         );
    //         let followeesPaged: Follow[] = page.values;
    //         console.log("  Page 1:");
    //         followeesPaged.forEach((f) => {
    //             console.log("    " + f.toString());
    //         });
    //         console.log("  More Pages? ", page.hasMorePages, "\n");
    //         const lastFolloweeHandle =
    //             followeesPaged[followeesPaged.length - 1].followee_handle;
    //         page = await followDAO.getPageOfFollowees("@bryce", lastFolloweeHandle);
    //         followeesPaged = page.values;
    //         console.log("  Page 2:");
    //         followeesPaged.forEach((f) => {
    //             console.log("    " + f.toString());
    //         });
    //         console.log("  More Pages? ", page.hasMorePages, "\n");
    //         // get 2 pages of followers
    //         console.log("Getting Followers: ");
    //         page = await followDAO.getPageOfFollowers("@tolman");
    //         let followersPaged: Follow[] = page.values;
    //         console.log("  Page 1:");
    //         followersPaged.forEach((f) => {
    //             console.log("    " + f.toString());
    //         });
    //         console.log("  More Pages? ", page.hasMorePages, "\n");
    //         const lastFollowerHandle =
    //             followersPaged[followersPaged.length - 1].follower_handle;
    //         page = await followDAO.getPageOfFollowers(
    //             "@tolman",
    //             lastFollowerHandle
    //         );
    //         followersPaged = page.values;
    //         console.log("Page 2:");
    //         followersPaged.forEach((f) => {
    //             console.log("    " + f.toString());
    //         });
    //         console.log("  More Pages? ", page.hasMorePages, "\n");
    //     }
    // }
    // function run() {
    //     new Main().run();
    // }
    // run();
}
