import * as React from 'react';
import {buildFromUrl, HistoryProps, SearchComponent, SearchState} from 'react-onex';
import PageSizeSelect from 'react-page-size-select';
import Pagination from 'react-pagination-x';
import {Link} from 'react-router-dom';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, initForm, initMaterial, setSearchPermission, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {Group} from '../model/Group';
import {GroupSM} from '../search-model/GroupSM';

export class GroupsForm extends SearchComponent<Group, GroupSM, HistoryProps, SearchState<Group>> {
  constructor(props) {
    super(props, applicationContext.groupService, storage.resource(), storage.ui(), showToast, alertError, getLocale, storage.loading());
    this.formatter = applicationContext.businessSearchModelFormatter;
    this.state = {
      keyword: '',
      ctrlStatusList: [],
      entityTypeList: [],
      results: [],
      ctrlStatus: [],
      entityType: [],
      groupId: ''
    };
  }
  private readonly masterDataService = applicationContext.masterDataService;
  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    setSearchPermission(storage.getUser(), this.url, applicationContext.searchPermissionBuilder, this);
    const s = this.mergeSearchModel(buildFromUrl(), ['ctrlStatus', 'entityType']);
    this.init(s, storage.autoSearch);
  }
  init(s: GroupSM, auto: boolean) {
    Promise.all([
      this.masterDataService.getEntityTypes(),
      this.masterDataService.getCtrlStatus()
    ]).then(
      (values) => {
        const [entityTypeList, ctrlStatusList] = values;
        this.setState({ entityTypeList, ctrlStatusList }, () => this.load(s, auto));
      }
    ).catch(this.handleError);
  }

  edit = (e, group: Group) => {
    e.preventDefault();
    this.props.history.push('groups/edit/' + group.groupId + '/' + group.cId);
  }

  approve = (e, group: Group) => {
    e.preventDefault();
    this.props.history.push('groups/approve/' + group.groupId + '/' + group.cId);
  }

  render() {
    const resource = this.resource;
    const { ctrlStatusList, entityTypeList, ctrlStatus, entityType, groupId } = this.state;
    return (
      <div className='view-container'>
        <header>
          <h2>{resource.group_list}</h2>
          {this.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={this.add} />}
        </header>
        <div>
          <form id='groupsForm' name='groupsForm' noValidate={true} ref={this.ref}>
            <section className='row search-group inline'>
              <label className='col s12 m6 l3'>
                {resource.group_id}
                <input
                  type='text'
                  id='groupId'
                  name='groupId'
                  value={groupId}
                  onChange={this.updateState}
                  maxLength={20}
                  placeholder={resource.group_id} />
              </label>
              <label className='col s12 m6 l4'>
                {resource.entity_type}
                <section className='checkbox-group'>
                  {entityTypeList.map((item, index) => (
                    <label key={index}>
                      <input
                        type='checkbox'
                        id={item.value}
                        name='entityType'
                        key={index}
                        value={item.value}
                        checked={entityType.includes(item.value)}
                        onChange={this.updateState} />
                      {item.text}
                    </label>
                  )
                  )}
                </section>
              </label>
              <label className='col s12 m12 l5'>
                {resource.ctrl_status}
                <section className='checkbox-group'>
                  {ctrlStatusList.map((item, index) => (
                    <label key={index}>
                      <input
                        type='checkbox'
                        id={item.value}
                        name='ctrlStatus'
                        key={index}
                        value={item.value}
                        checked={ctrlStatus.includes(item.value)}
                        onChange={this.updateState} />
                      {item.text}
                    </label>
                  )
                  )}
                </section>
              </label>
            </section>
            <section className='btn-group'>
              <label>
                {resource.page_size}
                <PageSizeSelect pageSize={this.pageSize} pageSizes={this.pageSizes} onPageSizeChanged={this.pageSizeChanged} />
              </label>
              <button type='submit' className='btn-search' onClick={this.searchOnClick}>{resource.search}</button>
            </section>
          </form>
          <form className='list-result'>
            <div className='table-responsive'>
              <table>
                <thead>
                  <tr>
                    <th>{resource.sequence}</th>
                    <th data-field='groupId'><button type='button' id='sortGroupId' onClick={this.sort}>{resource.group_id}</button></th>
                    <th data-field='groupName'><button type='button' id='sortGroupName' onClick={this.sort}>{resource.group_name}</button></th>
                    <th data-field='ctrlStatus'><button type='button' id='sortCtrlStatus' onClick={this.sort}>{resource.ctrl_status}</button></th>
                    <th data-field='actedBy'><button type='button' id='sortActedBy' onClick={this.sort}>{resource.acted_by}</button></th>
                    <th data-field='actionDate'><button type='button' id='sortActionDate' onClick={this.sort}>{resource.action_date}</button></th>
                    <th data-field='actionStatus'><button type='button' id='sortActionStatus' onClick={this.sort}>{resource.action_status}</button></th>
                    <th className='action'>{resource.quick_action}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state && this.state.results && this.state.results.map((group, i) => {
                    return (
                      <tr key={i}>
                        <td className='text-right'>{group.sequenceNo}</td>
                        <td><Link to={'groups/' + group.groupId + '?action=edit'}>{group.groupId}</Link>
                        </td>
                        <td>{group.groupName}</td>
                        <td>{group.ctrlStatusName}</td>
                        <td>{group.actedBy}</td>
                        <td>{group.actionDate}</td>
                        <td>{group.actionStatus}</td>
                        <td>
                          {(this.editable || this.viewable) &&
                            <button type='button' id={'btnView' + i} className={this.editable ? 'btn-edit' : 'btn-view'} onClick={(e) => this.edit(e, group)} />}
                          {this.approvable && group.ctrlStatus === 'P' &&
                            <button type='button' id={'btnApprove' + i} className='btn-approve' onClick={(e) => this.approve(e, group)} />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination className='col s12 m6' totalRecords={this.itemTotal} itemsPerPage={this.pageSize} maxSize={this.pageMaxSize} currentPage={this.pageIndex} onPageChanged={this.pageChanged} initPageSize={this.initPageSize}/>
          </form>
        </div>
      </div>
    );
  }
}
