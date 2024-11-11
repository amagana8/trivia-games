import { Column, GridGame } from "src/pb/gridGame";

export class GridGameDto implements GridGame {
  id: string;
  authorId: string;
  grid: Column[];
  createdAt: string;
  updatedAt: string;
}
