import { TableclothPatternProvider } from "../../decoration/DecorationPlacer";

export class ChristmasTableclothPatternProvider
    implements TableclothPatternProvider
{
    getTablecloth(): string {
        return "trees and presents";
    }
}
