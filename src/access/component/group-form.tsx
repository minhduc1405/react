import {ValueText} from 'onecore';
import * as React from 'react';
import {buildId, EditComponent, HistoryProps} from 'react-onex';
import {alertError, confirm} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, initForm, initMaterial, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {Group} from '../model/Group';

interface InternalState {
  group: Group;
  date: Date;
  entityTypeList: ValueText[];
}

export class GroupForm extends EditComponent<Group, any, HistoryProps, InternalState> {
  constructor(props) {
    super(props, applicationContext.groupService, storage.resource(), storage.ui(), showToast, alertError, confirm, getLocale, storage.loading());
    this.state = {
      group: this.createModel(),
      date: new Date(),
      entityTypeList: []
    };
  }
  private readonly masterDataService = applicationContext.masterDataService;
  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    const id = buildId(this.keys, this.props);
    this.init(id);
  }
  init(id: any) {
    this.masterDataService.getEntityTypes().then(entityTypeList => {
      this.setState(prevState => ({
        ...prevState,
        entityTypeList,
      }), () => this.load(id));
    }).catch(this.handleError);
  }

  render() {
    const resource = this.resource;
    const group = this.state.group;
    const {entityTypeList} = this.state;
    return (
      <div className='view-container'>
        <form id='groupForm' name='groupForm' model-name='group' ref={this.ref}>
          <header>
            <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={this.back}/>
            <h2>{this.newMode ? resource.create : resource.edit} {'Location'}</h2>
          </header>
          <div>
            <div className='form-group'>
              <label htmlFor='entityType'>{resource.entity_type}</label>
              <select id='entityType' name='entityType'
                      className='form-control'
                      value={group.entityType}
                      onChange={this.updateState}
                      required={true}>
                <option selected={true} value=''>Please selet</option>
                {entityTypeList.map((item, index) => (
                  <option key={index} value={item.value}>{item.text}</option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label htmlFor='groupId'>{resource.group_id}</label>
              <input type='text'
                     id='groupId' name='groupId'
                     className='form-control'
                     value={group.groupId}
                     onChange={this.updateState}
                     maxLength={20} required={true}
                     disabled={!this.newMode}
                     placeholder={resource.group_id}/>
            </div>
            <div className='form-group'>
              <label htmlFor='groupName'>{resource.group_name}</label>
              <input type='text'
                     id='groupName' name='groupName'
                     className='form-control'
                     value={group.groupName}
                     onChange={this.updateState}
                     maxLength={20} required={true}
                     disabled={!this.newMode}
                     placeholder={resource.group_id}/>
            </div>
            {/*
            <label className='col s12'>
              {resource.entity_type}
              <select id='entityType' name='entityType'
                      value={group.entityType}
                      onChange={this.updateState}
                      required={true}>
                <option selected={true} value=''>Please selet</option>
                {entityTypeList.map((item, index) => (
                  <option key={index} value={item.value}>{item.text}</option>
                ))}
              </select>
            </label>
            <label className='col s12 m6'>
              {resource.group_id}
              <input type='text'
                     id='groupId' name='groupId'
                     value={group.groupId}
                     onChange={this.updateState}
                     maxLength={20} required={true}
                     disabled={!this.newMode}
                     placeholder={resource.group_id}/>
            </label>
            <label className='col s12'>
              {resource.group_name}
              <input type='text'
                     id='groupName' name='groupName'
                     value={group.groupName}
                     onChange={this.updateState}
                     maxLength={60} required={true}
                     placeholder={resource.group_name}/>
            </label>*/}
          </div>
          <footer>
            {this.editable &&
            <button type='submit' id='btnSave' name='btnSave' onClick={this.saveOnClick}>
              {resource.save}
            </button>
            }
          </footer>
        </form>
      </div>
    );
  }
}
