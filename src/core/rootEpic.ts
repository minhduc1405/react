import {combineEpics} from 'redux-observable';
import {EpicFormatter} from 'redux-plus';

const epicComponents = [
];
export const rootEpic = combineEpics(
  ...EpicFormatter.formatEpicComponents(epicComponents)
);
