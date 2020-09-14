import {hasPrivilege} from 'src/core/authorization';
import {SearchPermission, SearchPermissionBuilder} from 'uione';
import {UserAccount} from 'uione';
import {UserType} from '../enum/UserType';

export class DefaultSearchPermissionBuilder implements SearchPermissionBuilder {
  buildPermission(user: UserAccount, url: string): SearchPermission {
    let p: SearchPermission;
    if (!user) {
      p = {
        'viewable': false,
        'addable': false,
        'editable': false,
        'approvable': false,
        'deletable': false
      };
    } else {
      const userType = user.userType;
      const privileges = user.privileges;
      p = {
        'viewable': false,
        'addable': false,
        'editable': false,
        'approvable': false,
        'deletable': false
      };
      if (hasPrivilege(privileges, url)) {
        if (userType === UserType.Operator) {
          p = {
            'viewable': true,
            'addable': true,
            'editable': true,
            'approvable': false,
            'deletable': false
          };
        } else if (userType === UserType.Approver) {
          p = {
            'viewable': true,
            'addable': false,
            'editable': false,
            'approvable': true,
            'deletable': false
          };
        } else {
          p = {
            'viewable': false,
            'addable': false,
            'editable': false,
            'approvable': false,
            'deletable': false
          };
        }
      }
      }
    return p;
  }
}
