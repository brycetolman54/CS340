import { ChristmasTableclothPatternProvider } from "../holiday/Christmas/ChristmasTableclothPatternProvider";
import { ChristmasWallHangingProvider } from "../holiday/Christmas/ChristmasWallHangingProvider";
import { ChristmasYardOrnamentProvider } from "../holiday/Christmas/ChristmasYardOrnamentProvider";
import { FactoryInterface } from "./FactoryInterface";

export class ChristmasFactory implements FactoryInterface {
    getTableclothPatternProvider() {
        return new ChristmasTableclothPatternProvider();
    }
    getWallHangingProvider() {
        return new ChristmasWallHangingProvider();
    }
    getYardOrnamentProvider() {
        return new ChristmasYardOrnamentProvider();
    }
}
