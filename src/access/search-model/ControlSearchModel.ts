import {SearchModel} from 'onecore';
import {CtrlStatus} from '../enum/CtrlStatus';

export interface ControlSearchModel extends SearchModel {
  actionStatus: string;
  ctrlStatus: CtrlStatus;
  actedBy: string;
}
