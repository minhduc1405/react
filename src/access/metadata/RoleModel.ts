import {Model, Type} from 'onecore';
import {moduleModel} from './ModuleModel';
import {userModel} from './UserModel';

export const roleModel: Model = {
  name: 'role',
  attributes: {
    roleId: {
      type: Type.String,
      key: true
    },
    cId: {
      type: Type.String,
      key: true
    },
    roleDesc: {
      type: Type.String,
      length: 255,
      nullable: true
    },
    roleName: {
      type: Type.String ,
      length: 255
    },
    userType: {
      type: Type.String,
      length: 2
    },
    evUserReg: {
      type: Type.String,
      length: 1
    },
    evActivate: {
      type: Type.String,
      length: 1
    },
    actedBy: {
      type: Type.String,
      length: 50
    },
    ctrlStatus: {
      type: Type.String,
      length: 255
    },
    actionStatus: {
      type: Type.String,
      length: 1
    },
    assignedBy: {
      type: Type.String,
      length: 50
    },
    assignedCtrlStatus: {
      type: Type.String,
      length: 255
    },
    assignedStatus: {
      type: Type.String,
      length: 1
    },
    modules: {
      type: Type.Array,
      typeof: moduleModel
    },
    users: {
      type: Type.Array,
      typeof: userModel
    }
  }
};
