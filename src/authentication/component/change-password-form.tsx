import {PasswordChange} from 'password-component';
import {PasswordService} from 'password-component';
import * as React from 'react';
import {HistoryProps, navigate} from 'react-onex';
import {alertError} from 'ui-alert';
import {storage} from 'uione';
import logo from '../../assets/images/logo.png';
import {applicationContext} from '../config/ApplicationContext';
import {BaseComponent, InternalState} from './BaseComponent';

export interface ChangePasswordState extends InternalState {
  user: PasswordChange;
  confirmPassword: string;
  hiddenPasscode: boolean;
}

export class ChangePasswordForm extends BaseComponent<HistoryProps, ChangePasswordState> {
  constructor(props) {
    super(props, storage.resource(), alertError, storage.loading());
    this.signin = this.signin.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.passwordService = applicationContext.passwordService;
    const user: PasswordChange = {
      step: null,
      username: '',
      currentPassword: '',
      password: '',
      passcode: '',
    };
    this.state = {
      message: '',
      user,
      confirmPassword: '',
      hiddenPasscode: true
    };
  }

  private passwordService: PasswordService;

  signin() {
    navigate(this.props.history, 'signin');
  }

  validate = () => {
    const r = storage.resource();
    const user = this.state.user;
    if (!user.password || user.password === '') {
      const msg = r.format(r.value('error_required'), r.value('new_password'));
      this.showError(msg);
      return false;
    } else {
      if (!user.currentPassword || user.currentPassword === '') {
        const msg = r.format(r.value('error_required'), r.value('current_password'));
        this.showError(msg);
        return false;
      }
      if (user.password !== this.state.confirmPassword) {
        const msg = r.value('error_confirmed_password');
        this.showError(msg);
        return false;
      }
    }
    return true;
  }

  async changePassword(event) {
    event.preventDefault();
    if (!this.validate()) {
      return;
    }
    this.hideMessage();

    const user = this.state.user;
    try {
      const r = storage.resource();
      const result = await this.passwordService.changePassword(user);
      if (result === 2) {
        const msg = r.value('success_send_passcode_change_password');
        this.showMessage(msg);
        user.step = 1;
        this.setState({hiddenPasscode: false, user});
      } else if (result === 1) {
        const msg = r.value('success_change_password');
        this.showMessage(msg);
        setTimeout(() => {
          this.signin();
        }, 3000);
      } else {
        const msg = r.value('fail_change_password');
        this.showError(msg);
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  render() {
    const resource = storage.getResource();
    const { user } = this.state;
    return (
      <div className='view-container central-full'>
        <form id='changePasswordForm' name='changePasswordForm' noValidate={true} autoComplete='off' ref={this.ref}>
          <div>
            <img className='logo' src={logo}/>
            <h2>{resource.change_password}</h2>
            <div className={'message ' + this.alertClass}>
              {this.state.message}
              <span onClick={this.hideMessage} hidden={!this.state.message || this.state.message === ''}/>
            </div>
            <label hidden={!this.state.hiddenPasscode}>
              {resource.username}
              <input type='text'
                     id='username' name='username'
                     value={user.username}
                     onChange={this.updateState}
                     maxLength={255} required={true}
                     placeholder={resource.placeholder_username}/>
            </label>
            <label hidden={!this.state.hiddenPasscode}>
              {resource.current_password}
              <input type='password' className='form-control'
                     id='currentPassword' name='currentPassword'
                     value={user.username}
                     onChange={this.updateState}
                     maxLength={255} required={true}
                     placeholder={resource.placeholder_current_password}/>
            </label>
            <label hidden={!this.state.hiddenPasscode}>
              {resource.new_password}
              <input type='password' className='form-control'
                     id='password' name='password'
                     value={user.username}
                     onChange={this.updateState}
                     maxLength={255} required={true}
                     placeholder={resource.placeholder_new_password}/>
            </label>
            <label hidden={!this.state.hiddenPasscode}>
              {resource.confirm_password}
              <input type='password' className='form-control'
                     id='confirmPassword' name='confirmPassword'
                     onChange={this.updateFlatState}
                     maxLength={255} required={true}
                     placeholder={resource.placeholder_confirm_password}/>
            </label>
            <label hidden={this.state.hiddenPasscode}>
              {resource.passcode}
              <input type='text' className='form-control'
                     id='passcode' name='passcode'
                     value={user.passcode}
                     onChange={this.updateState}
                     maxLength={255} required={true}
                     placeholder={resource.placeholder_passcode}/>
            </label>
            <button type='submit' id='btnChangePassword' name='btnChangePassword'
                    onClick={this.changePassword}>{resource.button_change_password}</button>
            <a id='btnSignin' onClick={this.signin}>{resource.button_signin}</a>
          </div>
        </form>
      </div>
    );
  }
}
