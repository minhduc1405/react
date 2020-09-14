import * as React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {HistoryProps, navigate} from 'react-onex';
import {alertError} from 'ui-alert';
import {storage} from 'uione';
import {isEmail} from 'validation-util';
import logo from '../../assets/images/logo.png';
import {applicationContext} from '../config/ApplicationContext';
import {SignupInfo} from '../model/SignupInfo';
import {SignupStatus} from '../model/SignupStatus';
import {SignupService} from '../service/SignupService';
import {BaseComponent, InternalState} from './BaseComponent';

interface SignupState extends InternalState {
  user: SignupInfo;
  confirmPassword: string;
  reCAPTCHAValue: string;
  checkPassword: boolean;
}

export class SignupForm extends BaseComponent<HistoryProps, SignupState> {
  constructor(props) {
    super(props, storage.resource(), alertError, storage.loading());
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
    this.userRegistrationService = applicationContext.signupService;
    const user: SignupInfo = {
      username: '',
      contact: '',
      password: '',
    };
    this.state = {
      message: '',
      user,
      confirmPassword: '',
      reCAPTCHAValue: '',
      checkPassword: true
    };
  }

  private userRegistrationService: SignupService;

  checkPass = () => {
      this.setState({
        checkPassword: !this.state.checkPassword
      });
  }

  signin() {
    navigate(this.props.history, 'connect/signin');
  }

  async signup(event) {
    event.preventDefault();
    const {reCAPTCHAValue} = this.state;
    if (!reCAPTCHAValue) {
      this.showError('You must check captcha');
      return;
    }
    const user = this.state.user;
    const confirmPassword = this.state.confirmPassword;
    const r = storage.resource();
    if (!user.username || user.username === '') {
      const msg = r.format(r.value('error_required'), r.value('username'));
      this.showError(msg);
      return;
    } else if (!isEmail(user.contact)) {
      const msg = r.format(r.value('error_email'), r.value('email'));
      this.showError(msg);
      return;
    } else if (!this.state.checkPassword && (!user.password || user.password === '')) {
      const msg = r.format(r.value('error_required'), r.value('password'));
      this.showError(msg);
      return;
    } else if (!this.state.checkPassword && (!confirmPassword || confirmPassword === '' || confirmPassword !== user.password)) {
      const msg = r.format(r.value('error_required'), r.value('confirm_password'));
      this.showError(msg);
      return;
    }
    try {
      const result = await this.userRegistrationService.signup(user);
      if (result.status === SignupStatus.Success) {
        const msg = r.value('success_sign_up');
        this.showMessage(msg);
      } else if (result.status === SignupStatus.UserNameError) {
        const msg = r.value('fail_sign_up_username_existed');
        this.showError(msg);
      } else if (result.status === SignupStatus.EmailError) {
        const msg = r.value('fail_sign_up_email_existed');
        this.showError(msg);
      } else if (result.status === SignupStatus.PasswordError) {
        const msg = r.value('fail_sign_up_password_decode');
        this.showError(msg);
      } else {
        const msg = r.value('fail_sign_up');
        this.showError(msg);
      }
    } catch (err) {
      this.handleError(err);
    }
  }

  onChange = (value) =>  {
    this.setState({reCAPTCHAValue: value});
  }
  render() {
    const resource = storage.getResource();
    const { message, user } = this.state;
    return (
      <div className='view-container central-full'>
        <form id='signupForm' name='signupForm' noValidate={true} autoComplete='off' ref={this.ref}>
          <div>
            <img className='logo' src={logo}/>
            <h2>{resource.signup}</h2>
            <div className={'message ' + this.alertClass}>
              {message}
              <span onClick={this.hideMessage} hidden={!message || message === ''}/>
            </div>
            <label>
              {resource.username}
              <input type='text'
                id='username' name='username'
                value={user.username}
                placeholder={resource.placeholder_username}
                onChange={this.updateState}
                maxLength={255} required={true}/>
            </label>
            <label>
              {resource.email}
              <input type='text'
                     id='contact' name='contact'
                     value={user.contact}
                     placeholder={resource.placeholder_email}
                     onChange={this.updateState}
                     maxLength={255} required={true}/>
            </label>
            <label>
              use password:
              <input id = 'usePass' name='usePass'
                  type='checkbox'
                  checked={this.state.checkPassword}
                  onChange={() => this.checkPass()} />
            </label>
            <label hidden={this.state.checkPassword}>
              {resource.password}
              <input type='password'
                id='password' name='password'
                value={user.password}
                placeholder={resource.placeholder_password}
                onChange={this.updateState}
                maxLength={255} required={true}/>
            </label>
            <label hidden={this.state.checkPassword}>
              {resource.confirm_password}
              <input type='password'
                     id='confirmPassword' name='confirmPassword'
                     placeholder={resource.placeholder_confirm_password}
                     onChange={this.updateState}
                     maxLength={255} required={true}/>
            </label>
            <div style={{marginTop: '10px'}}>
              <ReCAPTCHA
              sitekey='6LetDbQUAAAAAEqIqVnSKgrI644y8w7O8mk89ijV'
              onChange={this.onChange}
            />
            </div>
            <button type='submit' id='btnSignup' name='btnSignup' onClick={this.signup}>
              {resource.button_signup}
            </button>
            <a id='btnSignin' onClick={this.signin}>{resource.button_signin}</a>
          </div>
        </form>
      </div>
    );
  }
}
