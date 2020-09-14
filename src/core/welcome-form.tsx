import * as React from 'react';
import {BaseComponent, HistoryProps} from 'react-onex';
import {Link} from 'react-router-dom';
import {alertError} from 'ui-alert';
import {getLocale, storage} from 'uione';
import './welcome-form.css';

export class WelcomeForm extends BaseComponent<HistoryProps, any> {
  constructor(props) {
    super(props, storage.resource(), storage.ui(), alertError, getLocale);
    this.state = {
      forms: []
    };
  }

  componentWillMount() {
    /*
    if (!this.formService) {
      this.formService = new FormServiceImpl();
    }
    this.formService.getMyForm().subscribe(forms => {
      if (forms) {
        this.setState({ forms });
      } else {
        this.props.history.push('/');
      }
    });
    */
    const forms = storage.forms();
    this.setState({ forms });
  }
  renderForms = (features) => {
    return (
      features.map((feature, idx) => {
        return this.renderForm(feature, idx);
      })
    );
  }

  renderForm = (feature: any, idx) => {
    const resourceKey = this.resource[feature.resourceKey];
    const name = (!resourceKey || resourceKey.length === 0) ? feature.name : this.resource[feature.resourceKey];
    if (feature.children && Array.isArray(feature.children)) {
      const className = (!feature.icon || feature.icon.length === 0) ? 'settings' : feature.icon;
      const features = feature.children;
      return (
        <label className='col s12 m12' key={idx}>
          <i className={className + ' menu-type'} /><span className='menu-type'>{name}</span>
          <div>
            <i className='material-icons menu-type'>{className}</i><span className='menu-type'>{name}</span>
          </div>
          <ul className='menu-ul'>
            {this.renderForms(features)}
          </ul>
          <hr />
        </label>
      );
    } else {
      const className = (!feature.icon || feature.icon.length === 0) ? 'settings' : feature.icon;
      return (
        <label className='col s6 m6 l3 welcome-span' key={idx}>
          <Link to={feature.path}>
            <div>
              <i className='material-icons'>{className}</i><span>{name}</span>
            </div>
          </Link>
        </label>
      );
    }
  }

  render() {
    const resource = this.resource;
    return (
      <div className='view-container'>
        <header>
          <h2 className='label'>{resource.welcome_title}</h2>
        </header>
        <br /><br />
        <React.Fragment>
          <section className='row welcome hr-height-1'>
            {this.renderForms(this.state.forms)}
          </section>
        </React.Fragment>
      </div>
    );
  }
}
