import * as React from 'react';
import {Diff} from 'react-diff-x';
import {DiffApprComponent, DiffState, HistoryProps} from 'react-onex';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {Role} from '../model/Role';

export class RoleAssignmentDiffForm extends DiffApprComponent<Role, any, HistoryProps, DiffState<Role>> {
  constructor(props) {
    super(props, applicationContext.roleAssignmentService, storage.resource(), getLocale, showToast, alertError, storage.loading());
    this.state = {
      origin: {},
      value: {},
    };
  }

  renderFields = [
    { resourceKey: 'user_type', name: 'userType' },
    { resourceKey: 'role_id', name: 'roleId' },
    { resourceKey: 'role_name', name: 'roleName' },
    { resourceKey: 'description', name: 'roleDesc' },
    { resourceKey: 'role_assigned_users', name: 'listUsername' },
  ];

  formatFields(value) {
    const listUsername = [];
    if (value.users) {
      for (const user of value.users) {
        listUsername.push(user.userId);
      }
    }

    return { ...value, listUsername };
  }

  render() {
    const resource = this.resource;
    const { origin, value, disabled } = this.state;
    return (
      <div className='view-container'>
        <form id='roleAssignmentDiffForm' name='roleAssignmentDiffForm' model-name='role' ref={this.ref}>
          <header>
            <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={this.back} />
            <h2>{resource.role_assignment_subject}</h2>
          </header>
          <Diff origin={origin}
                     value={value}
                     resource={resource}
                     renderFields={this.renderFields}
          />
          <footer>
            <button type='submit' id='btnApprove' name='btnApprove' onClick={this.approve}
              disabled={disabled}>
              {resource.approve}
            </button>
            <button type='button' id='btnReject' name='btnReject' onClick={this.reject}
              disabled={disabled}>
              {resource.reject}
            </button>
          </footer>
        </form>
      </div>
    );
  }
}
