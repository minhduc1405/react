import {Model, Type} from 'onecore';

export const userModel: Model = {
  name: 'user',
  attributes: {
    userId: {
      type: Type.String,
      length: 20,
      nullable: false,
      key: true
    },
    staffId: {
      type: Type.String,
      length: 20,
      nullable: false
    },
    firstName: {
      type: Type.String,
      length: 100,
      nullable: false
    },
    lastName: {
      type: Type.String,
      length: 100,
      nullable: true
    },
    title: {
      type: Type.String,
      length: 100,
      nullable: true
    },
    gender: {
      type: Type.String,
      length: 10,
      nullable: true
    },
    pos: {
      type: Type.String,
      length: 20,
      nullable: true
    },
    telephone: {
      type: Type.String,
      length: 100,
      nullable: true
    },
    email: {
      type: Type.String,
      length: 100,
      nullable: true
    },
    groupId: {
      type: Type.String,
      length: 20,
      nullable: true
    },
    roleType: {
      type: Type.String,
      length: 1,
      nullable: false
    },
    accessDateFrom: {
      type: Type.Date,
      nullable: true
    },
    accessDateTo: {
      type: Type.Date,
      nullable: true
    },
    accessTimeFrom: {
      type: Type.String,
      nullable: true
    },
    accessTimeTo: {
      type: Type.String,
      nullable: true
    },
    activate: {
      type: Type.String,
      length: 1,
      nullable: true
    },
    ctrlStatus: {
      type: Type.String,
      length: 1,
      nullable: true
    },
    actionStatus: {
      type: Type.String,
      length: 1,
      nullable: true
    },
    actedBy: {
      type: Type.String,
      length: 50,
      nullable: true
    },
    createdDate: {
      type: Type.String,
      nullable: true
    }
  }
};
