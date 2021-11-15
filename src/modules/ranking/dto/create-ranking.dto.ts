import { CompetitiveRankingFrecuency } from '../enum/competitive-ranking-frecuency.enum';

export class CreateRankingDto {
  name: string;
  description: string;
  applicationId: string;
  competitive: boolean;
  price: string;
  closeHour: string;
  playersToPrice: number;
  resetFrecuency: CompetitiveRankingFrecuency;
}
