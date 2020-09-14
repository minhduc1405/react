import {ViewSearchWebClient} from 'web-clients';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {roleModel} from '../../metadata/RoleModel';
import {Role} from '../../model/Role';
import {RoleSM} from '../../search-model/RoleSM';
import {ApprRoleAssignmentService} from '../ApprRoleAssignmentService';

export class ApprRoleAssignmentClient extends ViewSearchWebClient<Role, any, RoleSM> implements ApprRoleAssignmentService {
  constructor(http: HttpRequest) {
    super(config.backOfficeUrl + 'common/roles', http, roleModel);
  }
}
