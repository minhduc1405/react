import * as React from 'react';
import {buildId, EditComponent, HistoryProps} from 'react-onex';
import {alertError, confirm} from 'ui-alert';
import {showToast} from 'ui-toast';
import {getLocale, initForm, initMaterial, storage} from 'uione';
import {applicationContext} from '../config/ApplicationContext';
import {Role} from '../model/Role';

interface InternalState {
  role: Role;
}

export class RoleForm extends EditComponent<Role, any, HistoryProps, InternalState> {
  constructor(props) {
    super(props, applicationContext.roleService, storage.resource(), storage.ui(), showToast, alertError, confirm, getLocale, storage.loading());
    this.patchable = false;
    this.state = {
      role: this.createModel(),
      date: new Date(),
      userTypeList: [],
      availableModules: [],
      checkedAll: false,
      showModules: [],
      keyword: ''
    };
  }

  private readonly masterDataService = applicationContext.masterDataService;
  private readonly moduleService = applicationContext.moduleService;
  componentDidMount() {
    this.form = initForm(this.ref.current, initMaterial);
    const id = buildId(this.keys, this.props);
    this.init(id);
  }
  init(id: any) {
    Promise.all([
      this.masterDataService.getUserTypes(),
      this.moduleService.all()
    ]).then(values => {
      const [userTypeList, availableModules] = values;
      this.setState({ userTypeList, availableModules, showModules: availableModules }, () => this.load(id));
    }).catch(this.handleError);
  }
  showModel(model: Role) {
    const promise = new Promise((resolve, reject) => {
      super.showModel(model);
      resolve('Success!');
    });
    promise.then(() => {
      this.isCheckedAll();
    });
  }
  handleCheck = (event: any) => {
    const { role, availableModules } = this.state;
    event.persist();
    if (event.target.value === 'on') {
      const parent = availableModules.find(item =>
        item.moduleId === event.target.id);
      if (role.modules.filter(item =>
        item.parentId === event.target.id).length === parent.children.length) {
        role.modules = role.modules.filter(item =>
          item.parentId !== event.target.id);
      } else {
        role.modules = role.modules.filter(item =>
          item.parentId !== event.target.id);
        role.modules = role.modules.concat(parent.children);
      }
    } else if (event.target.value === 'all') {
      role.modules = [];
      if (event.target.checked) {
        role.modules = availableModules.reduce((resultArray, currentArray) =>
          resultArray = resultArray.concat(currentArray.children), []
        );
      }
    } else {
      let checked = true;
      const parent = availableModules.find(item =>
        item.moduleId === event.target.value);
      const child = parent.children.
        find(value =>
          value.moduleId === event.target.id);
      if (role.modules !== []) {
        checked = role.modules.find(item =>
          item.moduleId === event.target.id);
      } else {
        checked = false;
      }
      if (!checked) {
        role.modules.push(child);
      } else {
        role.modules = role.modules = role.modules.filter(item =>
          item.moduleId !== event.target.id);
      }
    }
    this.setState({ role }, () => this.isCheckedAll());
  }

  isCheckedAll = () => {
    const { role, availableModules } = this.state;
    const lenAv = availableModules.reduce((len, modules) =>
      len += modules.children.length, 0);
    const checkedAll = role.modules && role.modules.length === lenAv;
    this.setState({ checkedAll });
  }
  renderForms = (features) => {
    if (!features) {
      return '';
    }
    return (
      features.map((feature) => {
        return this.renderForm(feature);
      })
    );
  }

  renderForm = (feature: any) => {
    const { role, availableModules, keyword } = this.state;
    if (feature.parentId === '') {
      const children = availableModules.find(item => item.moduleId === feature.moduleId).children;
      const checked = role.modules && children ? (role.modules.filter(item =>
        item.parentId === feature.moduleId).length === children.length) : false;
      return (
        <section className='col s12'>
          <label className='checkbox-container'>
            <input
              type='checkbox'
              id={feature.moduleId}
              disabled={keyword !== ''}
              name={feature.moduleId}
              checked={checked}
              onChange={this.handleCheck} />
            {feature.fullName}
          </label>
          <section className='row checkbox-group'>
            {this.renderForms(feature.children)}
          </section>
          <hr />
        </section>
      );
    } else {
      return (
        <label className='col s6 m4 l3'>
          <input
            data-parent={feature.parentId}
            value={feature.parentId}
            type='checkbox'
            id={feature.moduleId}
            name={feature.moduleId}
            checked={role.modules ? role.modules.find(item =>
              item.moduleId === feature.moduleId) : false}
            onChange={this.handleCheck}
          />
          {/* {!!role.modules ? !!role.modules.find(item =>
            item.moduleId === feature.moduleId) : false} */}
          {feature.moduleName}
        </label>
      );
    }
  }
  onChangekeyword = (e) => {
    const keyword = e.target.value;
    const { availableModules } = this.state;
    if (keyword === '') {
      this.setState({ keyword, showModules: availableModules });
      return;
    } else {
      // const availableModulesCopy = [...availableModules];
      const showModules = availableModules.map(parent => {
        const parentCopy = Object.assign({}, parent);
        parentCopy.children = parentCopy.children.filter(son => son.moduleName.toLowerCase().includes(keyword.toLowerCase()));
        return parentCopy;
      }).filter(item => item.children.length > 0);
      this.setState({ keyword, showModules });
    }
  }
  render() {
    const resource = this.resource;
    const { showModules, keyword, role, userTypeList } = this.state;
    return (
      <div className='view-container'>
        <form id='roleForm' name='roleForm' model-name='role' ref={this.ref}>
          <header>
            <button type='button' id='btnBack' name='btnBack' className='btn-back' onClick={this.back} />
            <h2>{this.newMode ? resource.create : resource.edit} {resource.role_subject}</h2>
          </header>
          <div>
            <section className='row'>
              <label className='col s12 m6'>
                {resource.user_type}
                <select id='userType' name='userType'
                  value={role.userType}
                  onChange={this.updateState}
                  required={true}
                >
                  <option selected={true} value=''>{resource.please_select}</option>
                  {userTypeList.map((item, index) => (
                    <option key={index} value={item.value}>{item.text}</option>)
                  )}
                </select>
              </label>
              <label className='col s12 m6'>
                {resource.role_id}
                <input type='text'
                  id='roleId' name='roleId'
                  value={role.roleId}
                  onChange={this.updateState}
                  maxLength={20} required={true}
                  disabled={!this.newMode}
                  placeholder={resource.role_id} />
              </label>
              <label className='col s12 m6'>
                {resource.role_name}
                <input type='text'
                  id='roleName' name='roleName'
                  value={role.roleName}
                  onChange={this.updateState}
                  maxLength={255}
                  placeholder={resource.role_name} />
              </label>
              <label className='col s12 m6'>
                {resource.description}
                <input type='text'
                  id='roleDesc' name='roleDesc'
                  value={role.roleDesc}
                  onChange={this.updateState}
                  maxLength={255}
                  placeholder={resource.description} />
              </label>
            </section>
            <h4>
              <label>
                <input
                  type='checkbox'
                  value='all'
                  disabled={keyword !== ''}
                  checked={this.state.checkedAll}
                  onChange={this.handleCheck} />
                {resource.all_modules}
              </label>
              <label className='col s12 search-input'>
                <i className='btn-search' />
                <input type='text'
                  id='keyword'
                  name='keyword'
                  maxLength={40}
                  placeholder={resource.role_filter_modules}
                  value={keyword}
                  onChange={this.onChangekeyword} />
              </label>
            </h4>
            <section className='row hr-height-1'>
              {this.renderForms(showModules)}
            </section>
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

  isParentChecked = (form, parentId: string, childNames: string[]): boolean => {
    const children = [];
    for (const f of form) {
      if (childNames.find(v => v === f.name && parentId === f.getAttribute('data-parent'))) {
        children.push(f);
      }
    }
    return children.every(child => child.checked === true);
  }
}
