import {
    TableclothPatternProvider,
    WallHangingProvider,
    YardOrnamentProvider,
} from "../decoration/DecorationPlacer";

export interface FactoryInterface {
    getWallHangingProvider: () => WallHangingProvider;
    getYardOrnamentProvider: () => YardOrnamentProvider;
    getTableclothPatternProvider: () => TableclothPatternProvider;
}
