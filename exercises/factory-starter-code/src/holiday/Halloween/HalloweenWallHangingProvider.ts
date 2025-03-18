import { WallHangingProvider } from "../../decoration/DecorationPlacer";

export class HalloweenWallHangingProvider implements WallHangingProvider {
    getHanging(): string {
        return "spider-web";
    }
}
