import {ViewSearchService} from 'onecore';
import {Group} from '../model/Group';
import {GroupSM} from '../search-model/GroupSM';

export interface ApprGroupService extends ViewSearchService<Group, any, GroupSM> {
}
