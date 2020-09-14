import * as React from 'react';
import {Diff} from 'react-diff-x';
import {DiffApprComponent, DiffState, HistoryProps} from 'react-onex';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {Role} from '../model/Role';

export class RoleDiffForm extends DiffApprComponent<Role, any, HistoryProps, DiffState<Role>> {
  constructor(props) {
    super(props, applicationContext.roleService, storage.resource(), getLocale, showToast, alertError, storage.loading());
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
    { resourceKey: 'role_modules_assign_to_role', name: 'listModule' },
  ];

  formatFields(value) {
    const listModule = [];
    if (value.modules) {
      for (const module of value.modules) {
        listModule.push(module.moduleName);
      }
    }
    return { ...value, listModule };
  }

  detailForm = (valueForm, resource, subject) => {
    return (
      <React.Fragment>
        <h4>{subject}</h4>
        <label className='col s12 m6'>
          {resource.user_type}
          <label>
            {valueForm.userType}
          </label>
        </label>
        <label className='col s12 m6'>
          {resource.role_id}
          <label>
            {valueForm.roleId}
          </label>
        </label>
        <label className='col s12 m6'>
          {resource.role_name}
          <label>
            {valueForm.roleName}
          </label>
        </label>
        <label className='col s12 m6'>
          {resource.description}
          <label>
            {valueForm.roleDesc}
          </label>
        </label>
        <label className='col s12 m6'>
          {resource.role_modules_assign_to_role}
          <label>
            {valueForm && valueForm.modules ? valueForm.modules.map((item, index) => {
              return <li key={index}>{item.moduleName}</li>;
            }) : ''}
          </label>
        </label>
      </React.Fragment>
    );
  }

  render() {
    const resource = this.resource;
    const { origin, value, disabled } = this.state;
    return (
      <div className='view-container'>
        <form id='roleDiffForm' name='roleDiffForm' model-name='role' ref={this.ref}>
          <header>
            <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={this.back} />
            <h2>{resource.role_subject}</h2>
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
