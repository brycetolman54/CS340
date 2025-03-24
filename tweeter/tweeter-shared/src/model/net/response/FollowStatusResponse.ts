import { TweeterResponse } from "./TweeterResponse";

export interface FollowStatusResponse extends TweeterResponse {
    isFollower: boolean;
}
