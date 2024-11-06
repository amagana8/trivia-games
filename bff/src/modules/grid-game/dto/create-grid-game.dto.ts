import { Column } from "src/pb/gridGame";

export class CreateGridGameDto {
    authorId: string;
    grid: Column[];
}