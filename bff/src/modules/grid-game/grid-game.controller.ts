import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateGridGameRequest, GridGame, GridGameServiceClient } from 'src/pb/gridGame';

@Controller('grid-game')
export class GridGameController implements OnModuleInit {
    private gridGameService: GridGameServiceClient;

    constructor(@Inject('GRID_GAME_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.gridGameService = this.client.getService<GridGameServiceClient>('GridGameService');
    }

    @Post()
    async createGridGame(@Body() createGridGameDto: CreateGridGameRequest) {
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
    async updateGridGame(@Param('id')id : string, @Body() updateGridGameDto: GridGame) {
        if (id !== updateGridGameDto.id) {
            throw new HttpException('ID in path does not match ID in body', HttpStatus.BAD_REQUEST);
        }
        return this.gridGameService.updateGridGame(updateGridGameDto);
    }

    @Delete(':id')
    async deleteGridGame(@Param('id') id: string) {
        return this.gridGameService.deleteGridGame({ id });
    }
}
