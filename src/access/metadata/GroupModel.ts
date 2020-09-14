import {Model, Type} from 'onecore';

export const groupModel: Model = {
  name: 'group',
  attributes: {
    groupId: {
      type: Type.String,
      key: true
    },
    cId: {
      type: Type.String,
      key: true
    },
    entityType: {
      type: Type.String,
      length: 1,
      nullable: true
    },
    groupName: {
      type: Type.String ,
      length: 60
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
    }
  }
};
