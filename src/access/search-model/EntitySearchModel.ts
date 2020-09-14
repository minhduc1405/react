import {EntityType} from '../enum/EntityType';
import {ControlSearchModel} from './ControlSearchModel';

export interface EntitySearchModel extends ControlSearchModel {
  entityId: string;
  entityType: EntityType;
  entityName: string;
}
