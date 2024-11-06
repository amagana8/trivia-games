import { Body, Controller, Delete, Get, Inject, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GridGameServiceClient } from 'src/pb/gridGame';
import { CreateGridGameDto } from './dto/create-grid-game.dto';
import { UpdateGridGameDto } from './dto/update-grid-game.dto';

@Controller('grid-game')
export class GridGameController implements OnModuleInit {
    private gridGameService: GridGameServiceClient;

    constructor(@Inject('GRID_GAME_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.gridGameService = this.client.getService<GridGameServiceClient>('GridGameService');
    }

    @Post()
    async createGridGame(@Body() createGridGameDto: CreateGridGameDto) {
        return this.gridGameService.createGridGame(createGridGameDto);
    }

    @Get(':id')
    async getGridGame(@Param('id') id: string) {
        return this.gridGameService.getGridGame({ id });
    }

    @Get()
    async getAllGridGames() {
        return this.gridGameService.getAllGridGames({});
    }

    @Put(':id')
    async updateGridGame(@Param('id')id : string, @Body() updateGridGameDto: UpdateGridGameDto) {
        return this.gridGameService.updateGridGame({...updateGridGameDto, id});
    }

    @Delete(':id')
    async deleteGridGame(@Param('id') id: string) {
        return this.gridGameService.deleteGridGame({ id });
    }
}
