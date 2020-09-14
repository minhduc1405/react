import {GenericSearchDiffApprService, ResultInfo} from 'onecore';
import {Group} from '../model/Group';
import {GroupSM} from '../search-model/GroupSM';

export interface GroupService extends GenericSearchDiffApprService<Group, any, number|ResultInfo<Group>, GroupSM> {
}
