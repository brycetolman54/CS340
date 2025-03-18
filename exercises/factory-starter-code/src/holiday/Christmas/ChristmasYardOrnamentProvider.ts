import { YardOrnamentProvider } from "../../decoration/DecorationPlacer";

export class ChristmasYardOrnamentProvider implements YardOrnamentProvider {
    getOrnament(): string {
        return "snowman";
    }
}
