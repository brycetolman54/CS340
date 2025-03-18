import { TableclothPatternProvider } from "../../decoration/DecorationPlacer";

export class HalloweenTableclothPatternProvider
    implements TableclothPatternProvider
{
    getTablecloth(): string {
        return "ghosts and skeletons";
    }
}
