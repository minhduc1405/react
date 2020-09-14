import * as React from 'react';
import {buildFromUrl, HistoryProps, SearchComponent, SearchState} from 'react-onex';
import PageSizeSelect from 'react-page-size-select';
import Pagination from 'react-pagination-x';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, initForm, initMaterial, setSearchPermission, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {Role} from '../model/Role';
import {RoleSM} from '../search-model/RoleSM';

export class RolesForm extends SearchComponent<Role, RoleSM, HistoryProps, SearchState<Role>> {
  constructor(props) {
    super(props, applicationContext.roleService, storage.resource(), storage.ui(), showToast, alertError, getLocale, storage.loading());
    this.formatter = applicationContext.businessSearchModelFormatter;
    this.state = {
      keyword: '',
      ctrlStatusList: [],
      userTypeList: [],
      results: [],
      ctrlStatus: [],
      userType: [],
      roleName: ''
    };
  }

  private readonly masterDataService = applicationContext.masterDataService;

  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    setSearchPermission(storage.getUser(), this.url, applicationContext.searchPermissionBuilder, this);
    const s = this.mergeSearchModel(buildFromUrl(), ['ctrlStatus', 'userType']);
    this.init(s, storage.autoSearch);
  }

  init(s: RoleSM, auto: boolean) {
    Promise.all([
      this.masterDataService.getUserTypes(),
      this.masterDataService.getCtrlStatus()
    ]).then(values => {
      const [userTypeList, ctrlStatusList] = values;
      this.setState({ userTypeList, ctrlStatusList }, () => this.load(s, auto));
    }).catch(this.handleError);
  }

  edit = (e, id: string, cId: string) => {
    e.preventDefault();
    this.props.history.push('roles/edit/' + id + '/' + cId);
  }

  approve = (e, role: Role) => {
    e.preventDefault();
    this.props.history.push('roles/approve/' + role.roleId + '/' + role.cId);
  }

  render() {
    const resource = this.resource;
    const { ctrlStatusList, ctrlStatus, roleName } = this.state;
    const { userTypeList, userType } = this.state;
    return (
      <div className='view-container'>
        <header>
          <h2>{resource.role_list}</h2>
          {this.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={this.add} />}
        </header>
        <div>
          <form id='rolesForm' name='rolesForm' noValidate={true} ref={this.ref}>
            <section className='row search-group inline'>
              <label className='col s12 m6 l3'>
                {resource.role_name}
                <input
                  type='text'
                  id='roleName'
                  name='roleName'
                  value={roleName}
                  onChange={this.updateState}
                  maxLength={240}
                  placeholder={resource.roleName} />
              </label>
              <label className='col s12 m6 l3'>
                {resource.user_type}
                <section className='checkbox-group'>
                  {userTypeList.map((item, index) => (
                    <label key={index}>
                      <input
                        type='checkbox'
                        id={item.value}
                        name='userType'
                        key={index}
                        value={item.value}
                        checked={userType.includes(item.value)}
                        onChange={this.updateState} />
                      {item.text}
                    </label>
                  )
                  )}
                </section>
              </label>
              <label className='col s12 m12 l6'>
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
                    <th data-field='roleId'><button type='button' id='sortRoleId' onClick={this.sort}>{resource.role_id}</button></th>
                    <th data-field='roleName'><button type='button' id='sortRoleName' onClick={this.sort}>{resource.role_name}</button></th>
                    <th data-field='ctrlStatus'><button type='button' id='sortCtrlStatus' onClick={this.sort}>{resource.ctrl_status}</button></th>
                    <th data-field='actedBy'><button type='button' id='sortActedBy' onClick={this.sort}>{resource.acted_by}</button></th>
                    <th data-field='actionDate'><button type='button' id='sortActionDate' onClick={this.sort}>{resource.action_date}</button></th>
                    <th data-field='actionStatus'><button type='button' id='sortActionStatus' onClick={this.sort}>{resource.action_status}</button></th>
                    <th className='action'>{resource.quick_action}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state && this.state.results && this.state.results.map((role, i) => {
                    return (
                      <tr key={i}>
                        <td className='text-right'>{role.sequenceNo}</td>
                        <td>{role.roleId}</td>
                        <td>{role.roleName}</td>
                        <td>{role.ctrlStatusName}</td>
                        <td>{role.actedBy}</td>
                        <td>{role.actionDate}</td>
                        <td>{role.actionStatus}</td>
                        <td>
                          {(this.editable || this.viewable) &&
                            <button type='button' id={'btnView' + i} className={this.editable ? 'btn-edit' : 'btn-view'}
                              onClick={(e) => this.edit(e, role.roleId, role.cId)} />}
                          {this.approvable && role.ctrlStatus === 'P' &&
                            <button type='button' id={'btnApprove' + i} className='btn-approve' onClick={(e) => this.approve(e, role)} />}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination className='col s12 m6' totalRecords={this.itemTotal} itemsPerPage={this.pageSize} maxSize={this.pageMaxSize} currentPage={this.pageIndex} onPageChanged={this.pageChanged} />
          </form>
        </div>
      </div>
    );
  }
}
