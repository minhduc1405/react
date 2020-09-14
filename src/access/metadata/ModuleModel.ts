import {Model, Type} from 'onecore';

export const moduleModel: Model = {
  name: 'module',
  attributes: {
    moduleId: {
      type: Type.String,
      key: true
    },
    moduleName: {
      type: Type.String,
      length: 255,
      nullable: true
    },
    fullName: {
      type: Type.String ,
      length: 255
    },
    parentId: {
      type: Type.String,
      length: 50
    },
    path: {
      type: Type.String
    },
    icon: {
      type: Type.String,
      length: 255
    },
    createdDate: {
      type: Type.String,
      length: 255
    },
    updatedDate: {
      type: Type.String,
      length: 255
    }
  }
};
