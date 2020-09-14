import * as moment from 'moment';
import * as React from 'react';
import {DiffApprComponent, DiffState, HistoryProps} from 'react-onex';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {User} from '../model/User';

export class UserDiffForm extends DiffApprComponent<User, string, HistoryProps, DiffState<User>> {
  constructor(props) {
    super(props, applicationContext.userService, storage.resource(), getLocale, showToast, alertError, storage.loading());
    this.state = {
      origin: {},
      value: {},
    };
  }
  renderFields = [
    {resourceKey: 'user_id', name: 'userId'},
    {resourceKey: 'staff_id', name: 'staffId'},
    {resourceKey: 'first_name', name: 'firstName'},
    {resourceKey: 'last_name', name: 'lastName'},
    {resourceKey: 'person_title', name: 'title'},
    {resourceKey: 'gender', name: 'gender'},
    {resourceKey: 'position', name: 'pos'},
    {resourceKey: 'phone', name: 'telephone'},
    {resourceKey: 'email', name: 'email'},
    {resourceKey: 'group', name: 'groupId'},
    {resourceKey: 'user_access_date_from', name: 'accessDateFrom'},
    {resourceKey: 'user_access_date_to', name: 'accessDateTo'},
    {resourceKey: 'user_access_time_from', name: 'accessTimeFrom'},
    {resourceKey: 'user_access_time_to', name: 'accessTimeTo'},
  ];

  formatFields(value) {
    const dateFormat = storage.getDateFormat();
    const resource = this.resource;
    const gender = value && value.gender === 'M' ? resource.male : resource.female ;
    const roleType = value && value.roleType === 'M' ? resource.role_type_maker : resource.role_type_checker ;
    const pos = value.pos === 'E' ? resource.position_employee : (value.pos === 'M' ? resource.position_manager : resource.position_director);
    const activate = value.activate === 'T' ? resource.true : resource.false;
    const accessDateFrom = moment(value.accessDateFrom).format(dateFormat);
    const accessDateTo = moment(value.accessDateTo).format(dateFormat);
    return {...value, gender, roleType, pos, activate, accessDateFrom, accessDateTo};
  }

  render() {
    const resource = this.resource;
    const { origin, value, disabled } = this.state;
    return (
      <div className='view-container'>
        <form id='userDiffForm' name='userDiffForm' ref={this.ref}>
          <header>
            <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={this.back}/>
            <h2>{resource.user}</h2>
          </header>
          <div className='diff'>
            <h4>
              <span>{resource.field}</span>
              <span>{resource.old_data_subject}</span>
              <span>{resource.new_data_subject}</span>
            </h4>
            {this.renderFields && this.renderFields.map((item, i) => {
              return (
                <p key={i} data-field={item.name}>
                  <label>{resource[item.resourceKey]}</label><span>{origin[item.name]}</span><span>{value[item.name]}</span>
                </p>
              );
            })}
          </div>
          <footer>
            <button type='submit' id='btnApprove' name='btnApprove' onClick={this.approve} disabled={disabled}>
              {resource.approve}
            </button>
            <button type='button' id='btnReject' name='btnReject' onClick={this.reject} disabled={disabled}>
              {resource.reject}
            </button>
          </footer>
        </form>
      </div>
    );
  }
}
