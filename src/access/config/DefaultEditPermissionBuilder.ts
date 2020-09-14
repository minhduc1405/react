import {hasPrivilege} from 'src/core/authorization';
import {EditPermission, EditPermissionBuilder} from 'uione';
import {UserAccount} from 'uione';
import {UserType} from '../enum/UserType';

export class DefaultEditPermissionBuilder implements EditPermissionBuilder {
  buildPermission(user: UserAccount, url: string): EditPermission {
    let p: EditPermission;
    if (!user) {
      p = {
        'addable': false,
        'editable': false,
        'deletable': false
      };
    } else {
      const userType = user.userType;
      const privileges = user.privileges;
      p = {
        'addable': false,
        'editable': false,
        'deletable': false
      };
      if (hasPrivilege(privileges, url)) {
        if (userType === UserType.Operator) {
          p = {
            'addable': true,
            'editable': true,
            'deletable': false
          };
        } else if (userType === UserType.Approver) {
          p = {
            'addable': false,
            'editable': false,
            'deletable': false
          };
        } else {
          p = {
            'addable': false,
            'editable': false,
            'deletable': false
          };
        }
      }
      }
    return p;
  }
}
