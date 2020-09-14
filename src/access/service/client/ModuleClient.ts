import {ViewWebClient} from 'web-clients';
import {HttpRequest} from 'web-clients';
import config from '../../../config';
import {moduleModel} from '../../metadata/ModuleModel';
import {Module} from '../../model/Module';
import {ModuleService} from '../ModuleService';

export class ModuleClient extends ViewWebClient<Module, string> implements ModuleService {
  constructor(http: HttpRequest) {
    super(config.backOfficeUrl + 'common/modules', http, moduleModel);
  }
  async all(ctx?: any): Promise<Module[]> {
    const list = await super.all(ctx);
    const available = [];
    if (list) {
      list.forEach(dad => {
        if (dad.parentId === '') {
          available.push(dad);
        }
      });
      available.sort((a, b) =>
        a.sequence - b.sequence);
      available.forEach(dad => {
        const son = list.filter(item => item.parentId === dad.moduleId);
        son.sort((a, b) =>
          a.order - b.order);
        dad.children = son;
      });
    }
    return available;
  }
}
