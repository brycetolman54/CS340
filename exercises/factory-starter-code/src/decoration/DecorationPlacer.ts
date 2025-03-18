import { FactoryInterface } from "../factory/FactoryInterface";

export interface TableclothPatternProvider {
    getTablecloth: () => string;
}
export interface WallHangingProvider {
    getHanging: () => string;
}
export interface YardOrnamentProvider {
    getOrnament: () => string;
}

export class DecorationPlacer {
    private tableclothPattern: TableclothPatternProvider;
    private wallHanging: WallHangingProvider;
    private yardOrnament: YardOrnamentProvider;

    public constructor(Factory: FactoryInterface) {
        this.tableclothPattern = Factory.getTableclothPatternProvider();
        this.wallHanging = Factory.getWallHangingProvider();
        this.yardOrnament = Factory.getYardOrnamentProvider();
    }

    placeDecorations(): string {
        return (
            "Everything was ready for the party. The " +
            this.yardOrnament.getOrnament() +
            " was in front of the house, the " +
            this.wallHanging.getHanging() +
            " was hanging on the wall, and the tablecloth with " +
            this.tableclothPattern.getTablecloth() +
            " was spread over the table."
        );
    }
}
