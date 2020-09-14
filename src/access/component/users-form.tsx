import {SearchModel} from 'onecore';
import * as React from 'react';
import {buildFromUrl, HistoryProps, SearchComponent, SearchState} from 'react-onex';
import PageSizeSelect from 'react-page-size-select';
import Pagination from 'react-pagination-x';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, initForm, initMaterial, setSearchPermission, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {User} from '../model/User';

export class UsersForm extends SearchComponent<User, SearchModel, HistoryProps, SearchState<User>> {
  constructor(props) {
    super(props, applicationContext.userService, storage.resource(), storage.ui(), showToast, alertError, getLocale, storage.loading());
    this.formatter = applicationContext.businessSearchModelFormatter;
    this.state = {
      keyword: '',
      ctrlStatusList: [],
      activationStatusList: [],
      results: [],
      ctrlStatus: [],
      activate: [],
      userId: ''
    };
  }
  private readonly masterDataService = applicationContext.masterDataService;

  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    setSearchPermission(storage.getUser(), this.url, applicationContext.searchPermissionBuilder, this);
    const s = this.mergeSearchModel(buildFromUrl(), ['ctrlStatus', 'activate']);
    this.init(s, storage.autoSearch);
  }

  init(s: SearchModel, autoSearch: boolean) {
    Promise.all([
      this.masterDataService.getStatus(),
      this.masterDataService.getCtrlStatus()
    ]).then(values => {
      const [activationStatusList, ctrlStatusList] = values;
      this.setState({ activationStatusList, ctrlStatusList }, () => this.load(s, autoSearch));
    }).catch(this.handleError);
  }

  edit = (e, id: string) => {
    e.preventDefault();
    this.props.history.push(`users/edit/${id}`);
  }

  approve = (e, id: string) => {
    e.preventDefault();
    this.props.history.push(`users/approve/${id}`);
  }

  render() {
    const resource = this.resource;
    const { ctrlStatusList, activationStatusList, userId, ctrlStatus, activate } = this.state;
    return (
      <div className='view-container'>
        <header>
          <h2>{resource.users}</h2>
          {this.addable && <button type='button' id='btnNew' name='btnNew' className='btn-new' onClick={this.add} />}
        </header>
        <div>
          <form id='usersForm' name='usersForm' noValidate={true} ref={this.ref}>
            <section className='row search-group inline'>
              <label className='col s12 m4 l3'>
                {resource.user_id}
                <input type='text'
                       id='userId' name='userId'
                       value={userId}
                       onChange={this.updateState}
                       maxLength={255}
                       placeholder={resource.user_id} />
              </label>
              <label className='col s12 m8 l4 checkbox-section'>
                {resource.activation_status}
                <section className='checkbox-group'>
                  {activationStatusList.map((item, index) => (
                    <label key={index}>
                      <input
                        type='checkbox'
                        id={item.value}
                        name='activate'
                        key={index}
                        value={item.value}
                        checked={activate.includes(item.value)}
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
                    <th data-field='userId'><button type='button' id='sortUserId' onClick={this.sort}>{resource.user_id}</button></th>
                    <th data-field='roleType'><button type='button' id='sortRoleType' onClick={this.sort}>{resource.role_type}</button></th>
                    <th data-field='activate'><button type='button' id='sortActivate' onClick={this.sort}>{resource.activation_status}</button></th>
                    <th data-field='ctrlStatus'><button type='button' id='sortCtrlStatus' onClick={this.sort}>{resource.ctrl_status}</button></th>
                    <th data-field='actedBy'><button type='button' id='sortActedBy' onClick={this.sort}>{resource.acted_by}</button></th>
                    <th data-field='actionDate'><button type='button' id='sortActionDate' onClick={this.sort}>{resource.action_date}</button></th>
                    <th data-field='actionStatus'><button type='button' id='sortActionStatus' onClick={this.sort}>{resource.action_status}</button></th>
                    <th className='action'>{resource.quick_action}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state && this.state.results && this.state.results.map((item, i) => {
                    return (
                      <tr key={i}>
                        <td className='text-right'>{item.sequenceNo}</td>
                        <td>{item.userId}</td>
                        <td>{item.roleType}</td>
                        <td>{item.activate}</td>
                        <td>{item.ctrlStatusName}</td>
                        <td>{item.actedBy}</td>
                        <td>{item.actionDate}</td>
                        <td>{item.actionStatus}</td>
                        <td>
                          {(this.editable || this.viewable) &&
                            <button type='button' id={'btnView' + i} className={this.editable ? 'btn-edit' : 'btn-view'}
                              onClick={(e) => this.edit(e, item.userId)} />}
                          {this.approvable && item.ctrlStatus === 'P' &&
                            <button type='button' id={'btnApprove' + i} className='btn-approve' onClick={(e) => this.approve(e, item.userId)} />}
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
