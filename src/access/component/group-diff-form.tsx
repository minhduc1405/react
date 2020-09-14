import * as React from 'react';
import {DiffApprComponent, DiffState, HistoryProps} from 'react-onex';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {Group} from '../model/Group';

interface InternalState extends DiffState<Group> {
  date: Date;
}

export class GroupDiffForm extends DiffApprComponent<Group, any, HistoryProps, InternalState> {
  constructor(props) {
    super(props, applicationContext.groupService, storage.resource(), getLocale, showToast, alertError, storage.loading());
    this.state = {
      date: new Date(),
      origin: this.initModel(),
      value: this.initModel(),
      disabled: false,
    };
  }

  renderFields = [
    {resourceKey: 'entity_type', name: 'entityType'},
    {resourceKey: 'group_id', name: 'groupId'},
    {resourceKey: 'group_name', name: 'groupName'}
  ];

  render() {
    const resource = this.resource;
    const { origin, value, disabled } = this.state;
    return (
      <div className='view-container'>
        <form id='groupForm' name='groupForm' ref={this.ref}>
          <header>
            <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={this.back}/>
            <h2>{resource.group_subject}</h2>
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
