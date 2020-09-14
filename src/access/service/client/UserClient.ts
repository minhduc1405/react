import {ResultInfo} from 'onecore';
import {GenericSearchDiffApprWebClient, json} from 'web-clients';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {userModel} from '../../metadata/UserModel';
import {User} from '../../model/User';
import {UserSM} from '../../search-model/UserSM';
import {UserService} from '../UserService';

export class UserClient extends GenericSearchDiffApprWebClient<User, string, number|ResultInfo<User>, UserSM> implements UserService {
  constructor(http: HttpRequest) {
    super(config.backOfficeUrl + 'users', http, userModel, null, true);
    this.searchGet = true;
  }
}
