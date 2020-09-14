import {ResultInfo} from 'onecore';
import {GenericSearchDiffApprWebClient} from 'web-clients';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {roleModel} from '../../metadata/RoleModel';
import {Role} from '../../model/Role';
import {RoleSM} from '../../search-model/RoleSM';
import {RoleService} from '../RoleService';

export class RoleClient extends GenericSearchDiffApprWebClient<Role, any, number|ResultInfo<Role>, RoleSM> implements RoleService {
  constructor(http: HttpRequest) {
    super(config.backOfficeUrl + 'roles', http, roleModel);
  }
}
