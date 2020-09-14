import {ViewSearchService} from 'onecore';
import {User} from '../model/User';
import {UserSM} from '../search-model/UserSM';

export interface ApprUserService extends ViewSearchService<User, number, UserSM> {
}
