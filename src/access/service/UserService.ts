import {ResultInfo} from 'onecore';
import {GenericSearchDiffApprService} from 'onecore';
import {User} from '../model/User';
import {UserSM} from '../search-model/UserSM';

export interface UserService extends GenericSearchDiffApprService<User, string, number|ResultInfo<User>, UserSM> {
}
