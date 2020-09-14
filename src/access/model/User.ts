import {ControlModel} from './ControlModel';

export class User extends ControlModel {
  userId: string;
  staffId: string;
  firstName: string;
  lastName: string;
  title: string;
  gender: string;
  pos: string;
  telephone: string;
  email: string;
  groupId: string;
  roleType: string;
  accessDateFrom: Date;
  accessDateTo: Date;
  accessTimeFrom: string;
  accessTimeTo: string;
  activate: string;
  createdDate: Date;
}
