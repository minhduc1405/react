import {ValueText} from 'onecore';
import * as React from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {DayModifiers} from 'react-day-picker/types';
import {buildId, EditComponent, HistoryProps} from 'react-onex';
import {setValue} from 'reflectx';
import {alertError, confirm} from 'ui-alert';
import {formatter} from 'ui-plus';
import {showToast} from 'ui-toast';
import {getLocale, initForm, initMaterial, storage} from 'uione';
import {emailOnBlur, phoneOnBlur} from 'uione';
import '../../assets/css//datepicker.css';
import {DatePicker} from '../../core/DatePicker';
import {applicationContext} from '../config/ApplicationContext';
import {Gender} from '../enum/Gender';
import {ModelStatus} from '../enum/ModelStatus';
import {UserType} from '../enum/UserType';
import {User} from '../model/User';

interface InternalState {
  user: User;
  titleList: ValueText[];
  positionList: ValueText[];
  groups: ValueText[];
  selectedDay: any;
}

export class UserForm extends EditComponent<User, string, HistoryProps, InternalState> {
  constructor(props) {
    super(props, applicationContext.userService, storage.resource(), storage.ui(), showToast, alertError, confirm, getLocale, storage.loading());
    this.componentDidMount = this.componentDidMount.bind(this);
    this.init = this.init.bind(this);
    this.updateDayPicker = this.updateDayPicker.bind(this);
    this.state = {
      user: this.createModel(),
      titleList: [],
      positionList: [],
      groups: [],
      selectedDay: undefined,
    };
  }
  protected dateFormat: string = storage.getDateFormat();
  private readonly masterDataService = applicationContext.masterDataService;
  private readonly groupService = applicationContext.apprGroupService;

  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    const id = buildId<string>(this.keys, this.props);
    this.init(id);
  }
  getKeyValue(objs, key, value) {
    return objs.map(item => {
      return { value: item[key], text: item[value] };
    });
  }

  init(id: string) {
    Promise.all([
      this.masterDataService.getTitles(),
      this.masterDataService.getPositions(),
      this.groupService.all(),
      this.masterDataService.getGenders(),
    ]).then(values =>  {
      const [titleList, positionList, xgroups, genders] = values;
      const groups = this.getKeyValue(xgroups, 'groupId', 'groupName');
      this.setState({
        titleList,
        positionList,
        groups
      }, () => this.load(id));
    }).catch(err => this.handleError(err));
  }

  loadGender(user?: User) {
    user = user === undefined ? this.state.user : user;
    if (user.title === 'Mr') {
      this.setState({ user: { ...user, gender: Gender.Male } });
    } else {
      this.setState({ user: { ...user, gender: Gender.Female } });
    }
  }

  createModel(): User {
    const user = super.createModel();
    user.activate = ModelStatus.Activated;
    user.roleType = UserType.Operator;
    user.accessTimeFrom = '00:00';
    user.accessTimeTo = '00:00';

    delete user.createdDate;

    return user;
  }

  protected updateDayPicker(day: Date, dayModifiers: DayModifiers, dayPickerInput: DayPickerInput) {
    const ctr = dayPickerInput;
    const props: any = ctr.props;
    const value = ctr.state.value;
    const input = ctr.getInput();
    const form = input.form;
    const modelName = form.getAttribute('model-name');
    const state = this.state[modelName];
    let dataField = props['data-field'];
    if (!dataField && input.parentElement.classList.contains('DayPickerInput')) {
      const label = input.parentElement.parentElement;
      dataField = label.getAttribute('data-field');
    }
    const valueSplit = value.split('/');
    const date = new Date(valueSplit[2], valueSplit[0] - 1, valueSplit[1]);

    if (props.setGlobalState) {
      const data = props.shouldBeCustomized ? this.prepareCustomData({ [dataField]: date }) : { [dataField]: date };
      props.setGlobalState({ [modelName]: { ...state, ...data } });
    } else {
      if (form) {
        if (modelName && modelName !== '') {
          if (dataField.indexOf('.') !== -1) {
            const arrSplit = dataField.split('.');
            const obj = {...state[arrSplit[0]], [arrSplit[1]]: date};
            this.setState({[modelName]: {...state, [arrSplit[0]]: obj}});
          } else {
            this.setState({[modelName]: {...state, [dataField]: date}});
          }
        } else {
          if (dataField.indexOf('.') > 0) {
            const split = dataField.split('.');
            const dateObj = this.state[split[0]];
            const indexdot = dataField.indexOf('.');
            const subrightdatafield = dataField.substring(indexdot, dataField.length);
            setValue(dateObj, subrightdatafield, date);
          } else {
            this.setState({[dataField]: date});
          }
        }
      }
    }
  }

  render() {
    const resource = this.resource;
    const { user } = this.state;
    const { titleList, positionList, groups } = this.state;
    return (
      <div className='view-container'>
        <form id='userForm' name='userForm' model-name='user' ref={this.ref}>
          <header>
            <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={this.back}/>
            <h2>{this.newMode ? resource.create : resource.edit} {resource.user}</h2>
          </header>
          <div className='row'>
            <label className='col s12 m6'>
              {resource.user_id}
              <input
                type='text'
                id='userId'
                name='userId'
                value={user.userId}
                onChange={this.updateState}
                maxLength={20} required={true}
                placeholder={resource.user_id} />
            </label>
            <label className='col s12 m6'>
              {resource.staff_id}
              <input
                type='text'
                id='staffId'
                name='staffId'
                value={user.staffId}
                onChange={this.updateState}
                maxLength={20} required={true}
                placeholder={resource.staff_id} />
            </label>
            <label className='col s12 m6'>
              {resource.first_name}
              <input
                type='text'
                id='firstName'
                name='firstName'
                value={user.firstName}
                onChange={this.updateState}
                maxLength={100} required={true}
                placeholder={resource.first_name} />
            </label>
            <label className='col s12 m6'>
              {resource.last_name}
              <input
                type='text'
                id='lastName'
                name='lastName'
                value={user.lastName}
                onChange={this.updateState}
                maxLength={100}
                placeholder={resource.last_name} />
            </label>
            <label className='col s12 m6'>
              {resource.person_title}
              <select
                id='title'
                name='title'
                value={user.title}
                onChange={(e) => {
                  this.updateState(e, this.loadGender);
                }}>
                <option selected={true} value=''>{resource.please_select}</option>
                )
                  {titleList.map((item, index) => (
                  <option key={index} value={item.value}>{item.text}</option>)
                )}
              </select>
            </label>
            <label className='col s12 m6'>
              {resource.gender}
              <div className='radio-group'>
                <label>
                  <input
                    type='radio'
                    id='gender'
                    name='gender'
                    onChange={this.updateState}
                    disabled={user.title !== 'Dr'}
                    value={Gender.Male} checked={user.gender === Gender.Male} />
                  {resource.male}
                </label>
                <label>
                  <input
                    type='radio'
                    id='gender'
                    name='gender'
                    onChange={this.updateState}
                    disabled={user.title !== 'Dr'}
                    value={Gender.Female} checked={user.gender === Gender.Female} />
                  {resource.female}
                </label>
              </div>
            </label>
            <label className='col s12 m6'>
              {resource.position}
              <select
                id='pos'
                name='pos'
                value={user.pos}
                onChange={this.updateState}>
                <option selected={true} value=''>{resource.please_select}</option>
                )
                  {positionList.map((item, index) => (
                  <option key={index} value={item.value}>{item.text}</option>)
                )}
              </select>
            </label>
            <label className='col s12 m6'>
              {resource.phone}
              <input
                type='tel'
                id='telephone'
                name='telephone'
                value={formatter.formatPhone(user.telephone)}
                onChange={this.updatePhoneState}
                onBlur={phoneOnBlur}
                maxLength={17}
                placeholder={resource.phone} />
            </label>
            <label className='col s12 m6'>
              {resource.email}
              <input
                type='text'
                id='email'
                name='email'
                data-type='email'
                value={user.email}
                onChange={this.updateState}
                onBlur={emailOnBlur}
                maxLength={100}
                placeholder={resource.email} />
            </label>
            <label className='col s12 m6'>
              {resource.group}
              <select
                id='groupId'
                name='groupId'
                value={user.groupId}
                onChange={this.updateState}>
                <option selected={true} value=''>{resource.please_select}</option>
                )
                  {groups.map((item, index) => (
                  <option key={index} value={item.value}>{item.text}</option>)
                )}
              </select>
            </label>
            <div className='col s12 m6 radio-section'>
              {resource.role_type}
              <div className='radio-group'>
                <label>
                  <input
                    type='radio'
                    id='roleType'
                    name='roleType'
                    onChange={this.updateState}
                    value={UserType.Operator} checked={user.roleType === UserType.Operator} />
                  {resource.role_type_maker}
                </label>
                <label>
                  <input
                    type='radio'
                    id='roleType'
                    name='roleType'
                    onChange={this.updateState}
                    value={UserType.Approver} checked={user.roleType === UserType.Approver} />
                  {resource.role_type_checker}
                </label>
              </div>
            </div>
            <div className='col s12 m6 radio-section'>
              {resource.user_activate}
              <div className='radio-group'>
                <label>
                  <input
                    type='radio'
                    id='activate'
                    name='activate'
                    onChange={this.updateState}
                    value={ModelStatus.Activated} checked={user.activate === ModelStatus.Activated} />
                  {resource.yes}
                </label>
                <label>
                  <input
                    type='radio'
                    id='activate'
                    name='activate'
                    onChange={this.updateState}
                    value={ModelStatus.Deactivated} checked={user.activate === ModelStatus.Deactivated} />
                  {resource.no}
                </label>
              </div>
            </div>
            <label className='col s12 m6'>
              {resource.user_access_date} ({this.dateFormat})
              <div>
                <label className='col s12 m6 up-date-picker' data-field='accessDateFrom'>
                  {resource.from}
                  <DatePicker
                    onChangeData={this.updateDateState}
                    value={user.accessDateFrom}
                    required={true}
                    name='accessDateFrom'
                    locale='en-IE'
                    className='form-group' />
                </label>
                <label className='col s12 m6'>
                  {resource.to}
                  <DatePicker
                    onChangeData={this.updateDateState}
                    value={user.accessDateTo}
                    minDate={user.accessDateFrom}
                    required={true}
                    name='accessDateTo'
                    locale='en-IE'
                    className='form-group' />
                </label>
              </div>
            </label>
            <label className='col s12 m6'>
              {resource.user_access_time}
              <div>
                <label className='col s12 m6'>
                  {resource.from}
                  <input
                    type='time'
                    id='accessTimeFrom'
                    name='accessTimeFrom'
                    value={user.accessTimeFrom}
                    onChange={this.updateState} />
                </label>
                <label className='col s12 m6'>
                  {resource.to}
                  <input
                    type='time'
                    id='accessTimeTo'
                    name='accessTimeTo'
                    value={user.accessTimeTo}
                    onChange={this.updateState} />
                </label>
              </div>
            </label>
          </div>
          <footer>
            {this.editable &&
              <button type='submit' id='btnSave' name='btnSave' onClick={this.saveOnClick}>
                {resource.save}
              </button>}
          </footer>
        </form>
      </div>
    );
  }
}
