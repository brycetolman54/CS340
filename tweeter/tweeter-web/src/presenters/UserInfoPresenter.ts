import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
    setIsFollower: (value: boolean) => void;
    setFolloweeCount: (value: number) => void;
    setFollowerCount: (value: number) => void;
}

export class UserInfoPresenter extends Presenter<UserService, UserInfoView> {
    private _isLoading = false;

    public constructor(view: UserInfoView) {
        super(view);
    }

    public get isLoading() {
        return this._isLoading;
    }

    protected createService(): UserService {
        return new UserService();
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
    ) {
        this.doFailureReportingOperation(async () => {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.service.getIsFollowerStatus(
                        authToken!,
                        currentUser!,
                        displayedUser!
                    )
                );
            }
        }, "determine follower status");
    }

    public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
        this.doFailureReportingOperation(async () => {
            this.view.setFolloweeCount(
                await this.service.getFolloweeCount(authToken, displayedUser)
            );
        }, "get followees count");
    }

    setNumbFollowers = async (authToken: AuthToken, displayedUser: User) => {
        this.doFailureReportingOperation(async () => {
            this.view.setFollowerCount(
                await this.service.getFollowerCount(authToken, displayedUser)
            );
        }, "get followers count");
    };

    public async followDisplayedUser(
        displayedUser: User,
        authToken: AuthToken
    ) {
        this.doFailureReportingOperation(
            async () => {
                this._isLoading = true;
                this.view.displayInfoMessage(
                    `Following ${displayedUser.name}...`,
                    0
                );

                const [followerCount, followeeCount] =
                    await this.service.follow(authToken, displayedUser);

                this.view.setIsFollower(true);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            "follow user",
            () => {
                this.view.clearLastInfoMessage();
                this._isLoading = false;
            }
        );
    }

    public async unfollowDisplayedUser(
        displayedUser: User,
        authToken: AuthToken
    ) {
        this.doFailureReportingOperation(
            async () => {
                this._isLoading = true;
                this.view.displayInfoMessage(
                    `Unfollowing ${displayedUser.name}...`,
                    0
                );

                const [followerCount, followeeCount] =
                    await this.service.unfollow(authToken!, displayedUser!);

                this.view.setIsFollower(false);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            "unfollow user",
            () => {
                this.view.clearLastInfoMessage();
                this._isLoading = false;
            }
        );
    }
}
