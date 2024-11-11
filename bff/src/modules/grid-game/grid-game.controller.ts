import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { DeleteGridGameResponse, GridGameServiceClient } from 'src/pb/gridGame';
import { CreateGridGameDto } from './dto/create-grid-game.dto';
import { UpdateGridGameDto } from './dto/update-grid-game.dto';
import { Observable } from 'rxjs';
import { GridGameDto } from './dto/grid-game.dto';
import { GridGameListDto } from './dto/grid-game-list.dto';

@Controller('grid-game')
export class GridGameController implements OnModuleInit {
    private gridGameService: GridGameServiceClient;

    constructor(@Inject('GRID_GAME_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.gridGameService = this.client.getService<GridGameServiceClient>('GridGameService');
    }

    @Post()
    createGridGame(@Body() createGridGameDto: CreateGridGameDto): Observable<GridGameDto> {
        return this.gridGameService.createGridGame(createGridGameDto);
    }

    @Get(':id')
    getGridGame(@Param('id') id: string): Observable<GridGameDto> {
        return this.gridGameService.getGridGame({ id });
    }

    @Get()
    getAllGridGames(): Observable<GridGameListDto> {
        return this.gridGameService.getAllGridGames({});
    }

    @Put(':id')
    updateGridGame(@Param('id')id : string, @Body() updateGridGameDto: UpdateGridGameDto): Observable<GridGameDto> {
        return this.gridGameService.updateGridGame({...updateGridGameDto, id});
    }

    @Delete(':id')
    deleteGridGame(@Param('id') id: string): Observable<DeleteGridGameResponse> {
        return this.gridGameService.deleteGridGame({ id });
    }
}
