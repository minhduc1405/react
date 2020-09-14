import {ResultInfo} from 'onecore';
import {GenericSearchDiffApprWebClient} from 'web-clients';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {groupModel} from '../../metadata/GroupModel';
import {Group} from '../../model/Group';
import {GroupSM} from '../../search-model/GroupSM';
import {GroupService} from '../GroupService';

export class GroupClient extends GenericSearchDiffApprWebClient<Group, any, number|ResultInfo<Group>, GroupSM> implements GroupService {
  constructor(http: HttpRequest) {
    super(config.backOfficeUrl + 'groups', http, groupModel);
  }
}
