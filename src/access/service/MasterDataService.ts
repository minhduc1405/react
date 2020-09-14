import {ValueText} from 'onecore';

export interface MasterDataService {
  getStatus(): Promise<ValueText[]>;
  getCtrlStatus(): Promise<ValueText[]>;
  getEntityTypes(): Promise<ValueText[]>;
  getUserTypes(): Promise<ValueText[]>;
  getTitles(): Promise<ValueText[]>;
  getPositions(): Promise<ValueText[]>;
  getGenders(): Promise<ValueText[]>;
}
