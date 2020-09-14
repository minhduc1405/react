import {SearchModel} from 'onecore';
import * as React from 'react';
import Modal from 'react-modal';
import {HistoryProps, SearchComponent, SearchState} from 'react-onex';
import PageSizeSelect from 'react-page-size-select';
import Pagination from 'react-pagination-x';
import {alertError} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, initForm, initMaterial, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {User} from '../model/User';

interface Props extends HistoryProps {
  isOpenModel?: any;
  onModelClose?: any;
  onModelSave?: any;
  roleAssignToUsers?: any;
  props?: any;
}

export class UsersLookup extends SearchComponent<User, SearchModel, Props, SearchState<User>> {
  constructor(props) {
    super(props, applicationContext.userService, storage.resource(), storage.ui(), showToast, alertError, getLocale, storage.loading());
    this.createSearchModel = this.createSearchModel.bind(this);
    this.state = {
      keyword: '',
      userId: '',
      results: [],
      roles: [],
      availableUsers: null
    };
  }
  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    this.load(this.createSearchModel(), storage.autoSearch);
  }
  createSearchModel(): SearchModel {
    const obj: any = {};
    return obj;
  }
  onCheckUser = (event) => {
    const { roles } = this.state;
    const { results } = this.state;
    const result = results.find((value) => value.userId === event.target.value);
    if (result) {
      const index = roles.indexOf(result);
      if (index !== -1) {
        delete roles[index];
      } else {
        roles.push(result);
      }
      this.setState({ roles });
    }
  }

  onModelSave = () => {
    this.setState({ roles: [], availableUsers: null, textSearch: '' });
    this.props.onModelSave(this.state.roles);
  }

  onModelClose = (event) => {
    this.setState({ roles: [], availableUsers: null, textSearch: '' });
    this.props.onModelClose(event);
  }

  protected clearUserId = () => {
    this.setState({
      userId: ''
    });
  }

  onChangeText = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSearch = (e) => {
    this.setState({ results: [] });
    this.searchOnClick(e);
  }

  render() {
    const { isOpenModel, roleAssignToUsers } = this.props;
    const { results } = this.state;
    const resource = this.resource;
    let index = 0;
    return (
      <Modal
        isOpen={isOpenModel}
        onRequestClose={this.props.onModelClose}
        contentLabel='Modal'
        // portalClassName='modal-portal'
        className='modal-portal-content'
        bodyOpenClassName='modal-portal-open'
        overlayClassName='modal-portal-backdrop'
      >
        <div className='view-container'>
          <header>
            <h2>{resource.users_lookup}</h2>
            <button type='button' id='btnClose' name='btnClose' className='btn-close' onClick={this.onModelClose}/>
          </header>
          <div>
            <form id='usersLookupForm' name='usersLookupForm' noValidate={true} ref={this.ref}>
              <section className='row search-group'>
                <label className='col s12 m6 search-input'>
                  <PageSizeSelect pageSize={this.pageSize} pageSizes={this.pageSizes} onPageSizeChanged={this.pageSizeChanged}/>
                  <input type='text'
                    id='userId'
                    name='userId'
                    onChange={this.onChangeText}
                    value={this.state.userId}
                    maxLength={40}
                    placeholder={resource.user_lookup}/>
                  <button type='button' hidden={!this.state.userId} className='btn-remove-text' onClick={this.clearUserId}/>
                  <button type='submit' className='btn-search' onClick={this.onSearch}/>
                </label>
                <Pagination className='col s12 m6' totalRecords={this.itemTotal} itemsPerPage={this.pageSize} maxSize={this.pageMaxSize} currentPage={this.pageIndex} onPageChanged={this.pageChanged} initPageSize={this.initPageSize}/>
              </section>
            </form>
            <form className='list-result'>
              <div className='table-responsive'>
                <table>
                  <thead>
                    <tr>
                      <th>{resource.sequence}</th>
                      <th data-field='userId'><button type='button' id='sortUserId' onClick={this.sort}>{resource.user_id}</button></th>
                      <th data-field='lastName'><button type='button' id='sortLastName' onClick={this.sort}>{resource.last_name}</button></th>
                      <th data-field='firstName'><button type='button' id='sortFirstName' onClick={this.sort}>{resource.first_name}</button></th>
                      <th data-field='ctrlStatus'><button type='button' id='sortCtrlStatus' onClick={this.sort}>{resource.ctrl_status}</button></th>
                      <th data-field='actedBy'><button type='button' id='sortActedBy' onClick={this.sort}>{resource.acted_by}</button></th>
                      <th data-field=''>{resource.quick_action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state && results && results.map((item, i) => {
                      const result = roleAssignToUsers.find((v) => {
                        if (v) {
                          return v.userId === item.userId;
                        }
                        return false;
                      });
                      if (!result) {
                        index++;
                        return (
                          <tr key={i}>
                            <td className='text-right'>{index}</td>
                            <td>{item.userId}</td>
                            <td>{item.lastName}</td>
                            <td>{item.firstName}</td>
                            <td>{item.ctrlStatus}</td>
                            <td>{item.actedBy}</td>
                            <td>
                              <input type='checkbox' id={'chkSelect' + i} value={item.userId} onClick={this.onCheckUser} />
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
          <footer>
            <button type='button' onClick={this.onModelSave}>{resource.select}</button>
          </footer>
        </div>
      </Modal>
    );
  }
}
