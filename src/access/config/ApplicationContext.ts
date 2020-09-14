import axios from 'axios';
import {HttpRequest} from 'axios-core';
import {LocaleFormatter} from 'onecore';
import {httpOptionsService} from 'uione';
import {ApprGroupClient} from '../service/client/ApprGroupClient';
import {ApprRoleAssignmentClient} from '../service/client/ApprRoleAssignmentClient';
import {ApprUserClient} from '../service/client/ApprUserClient';
import {GroupClient} from '../service/client/GroupClient';
import {MasterDataClient} from '../service/client/MasterDataClient';
import {ModuleClient} from '../service/client/ModuleClient';
import {RoleAssignmentClient} from '../service/client/RoleAssignmentClient';
import {RoleClient} from '../service/client/RoleClient';
import {UserClient} from '../service/client/UserClient';
import {MasterDataService} from '../service/MasterDataService';
import {BusinessSearchModelFormatter} from './BusinessSearchModelFormatter';
import {DefaultEditPermissionBuilder} from './DefaultEditPermissionBuilder';
import {DefaultSearchPermissionBuilder} from './DefaultSearchPermissionBuilder';

const httpRequest = new HttpRequest(axios, httpOptionsService);
class ApplicationContext {
  readonly businessSearchModelFormatter: LocaleFormatter<any> = new BusinessSearchModelFormatter();
  readonly editPermissionBuilder = new DefaultEditPermissionBuilder();
  readonly searchPermissionBuilder = new DefaultSearchPermissionBuilder();
  readonly masterDataService: MasterDataService = new MasterDataClient();
  readonly groupService = new GroupClient(httpRequest);
  readonly apprGroupService = new ApprGroupClient(httpRequest);
  readonly roleAssignmentService = new RoleAssignmentClient(httpRequest);
  readonly apprRoleAssignmentService = new ApprRoleAssignmentClient(httpRequest);
  readonly roleService = new RoleClient(httpRequest);
  readonly moduleService = new ModuleClient(httpRequest);
  readonly userService = new UserClient(httpRequest);
  readonly apprUserService = new ApprUserClient(httpRequest);
}

export const applicationContext = new ApplicationContext();

