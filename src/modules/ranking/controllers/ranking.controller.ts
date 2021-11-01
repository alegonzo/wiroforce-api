import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnApplicationBootstrap,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateRankingDto } from '../dto/create-ranking.dto';
import { RankingPaginationDto } from '../dto/ranking-pagination.dto';
import { UpdateRankingDto } from '../dto/update-ranking.dto';
import {
  RANKING_CLIENT,
  RANKING_CREATE,
  RANKINGS_BY_APP_ID,
  RANKING_GET_PLAYERS,
  RANKING_UPDATE,
  RANKING_COUNT,
  RANKING_DELETE,
} from '../utils/constants';

@Controller('rankings')
export class RankingsController implements OnApplicationBootstrap {
  constructor(@Inject(RANKING_CLIENT) private rankingClient: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.rankingClient.connect();
  }

  @Get()
  getAllByAppId(@Query('applicationId') applicationId: string) {
    const pattern = { cmd: RANKINGS_BY_APP_ID };
    return this.rankingClient.send(pattern, applicationId);
  }

  @Post()
  create(@Body() body: CreateRankingDto) {
    const pattern = { cmd: RANKING_CREATE };
    return this.rankingClient.send(pattern, body);
  }

  @Put()
  update(@Body() body: UpdateRankingDto) {
    const pattern = { cmd: RANKING_UPDATE };
    return this.rankingClient.send(pattern, body);
  }

  @Delete(':id')
  getReset(@Param('id') id: string) {
    const pattern = { cmd: RANKING_DELETE };
    return this.rankingClient.send(pattern, id);
  }

  @Get('count/:id')
  getRankingPlayersCount(@Param('id') id: string) {
    const pattern = { cmd: RANKING_COUNT };
    return this.rankingClient.send(pattern, id);
  }

  @Get('players')
  getPlayersInRanking(@Query() query: RankingPaginationDto) {
    const pattern = { cmd: RANKING_GET_PLAYERS };
    return this.rankingClient.send(pattern, query);
  }
}
