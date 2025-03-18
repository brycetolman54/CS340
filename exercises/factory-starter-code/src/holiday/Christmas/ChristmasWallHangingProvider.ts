import { WallHangingProvider } from "../../decoration/DecorationPlacer";

export class ChristmasWallHangingProvider implements WallHangingProvider {
    getHanging(): string {
        return "tinsel";
    }
}
