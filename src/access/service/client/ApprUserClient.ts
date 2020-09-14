import {ViewSearchWebClient} from 'web-clients';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {userModel} from '../../metadata/UserModel';
import {User} from '../../model/User';
import {UserSM} from '../../search-model/UserSM';
import {ApprUserService} from '../ApprUserService';

export class ApprUserClient extends ViewSearchWebClient<User, number, UserSM> implements ApprUserService {
  constructor(http: HttpRequest) {
    super(config.backOfficeUrl + 'common/users', http, userModel);
  }
}
