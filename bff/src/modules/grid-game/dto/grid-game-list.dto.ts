import { GetAllGridGamesResponse } from "src/pb/gridGame";
import { GridGameDto } from "./grid-game.dto";

export class GridGameListDto implements GetAllGridGamesResponse {
    gridGames: GridGameDto[];
}
