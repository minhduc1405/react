import {ViewSearchWebClient} from 'web-clients';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {groupModel} from '../../metadata/GroupModel';
import {Group} from '../../model/Group';
import {GroupSM} from '../../search-model/GroupSM';
import {ApprGroupService} from '../ApprGroupService';

export class ApprGroupClient extends ViewSearchWebClient<Group, any, GroupSM> implements ApprGroupService {
  constructor(http: HttpRequest) {
    super(config.backOfficeUrl + 'common/groups', http, groupModel);
  }
}
