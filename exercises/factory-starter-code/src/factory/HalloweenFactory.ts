import { HalloweenTableclothPatternProvider } from "../holiday/Halloween/HalloweenTableclothPatternProvider";
import { HalloweenWallHangingProvider } from "../holiday/Halloween/HalloweenWallHangingProvider";
import { HalloweenYardOrnamentProvider } from "../holiday/Halloween/HalloweenYardOrnamentProvider";
import { FactoryInterface } from "./FactoryInterface";

export class HalloweenFactory implements FactoryInterface {
    getTableclothPatternProvider() {
        return new HalloweenTableclothPatternProvider();
    }
    getWallHangingProvider() {
        return new HalloweenWallHangingProvider();
    }
    getYardOrnamentProvider() {
        return new HalloweenYardOrnamentProvider();
    }
}
