import {ResultInfo} from 'onecore';
import {GenericSearchDiffApprService} from 'onecore';
import {Role} from '../model/Role';
import {RoleSM} from '../search-model/RoleSM';

export interface RoleService extends GenericSearchDiffApprService<Role, any, number|ResultInfo<Role>, RoleSM> {
}
