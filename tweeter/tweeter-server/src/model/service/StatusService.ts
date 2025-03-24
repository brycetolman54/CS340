import { StatusDto, Status, FakeData } from "tweeter-shared";

export class StatusService {
    public async loadMoreFeedItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    }

    public async loadMoreStoryItems(
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: StatusDto | null
    ): Promise<[StatusDto[], boolean]> {
        return this.getFakeData(lastItem, pageSize);
    }

    public async postStatus(
        token: string,
        newStatus: StatusDto
    ): Promise<void> {
        await new Promise((f) => setTimeout(f, 2000));
    }

    private async getFakeData(
        lastItem: StatusDto | null,
        pageSize: number
    ): Promise<[StatusDto[], boolean]> {
        const [items, hasMore] = FakeData.instance.getPageOfStatuses(
            Status.fromDto(lastItem),
            pageSize
        );
        const dtos = items.map((status) => status.dto);
        return [dtos, hasMore];
    }
}
