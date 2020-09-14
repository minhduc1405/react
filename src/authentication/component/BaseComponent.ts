import * as H from 'history';
import * as React from 'react';
import {match} from 'react-router-dom';

export interface ResourceService {
  resource(): any;
  value(key: string, param?: any): string;
  format(...args: any[]): string;
}
export interface LoadingService {
  showLoading(firstTime?: boolean): void;
  hideLoading(): void;
}
export interface HistoryProps {
  location: H.Location;
  history: H.History;
  match?: match;
}
export interface InternalState {
  message: string;
}
export class BaseComponent<W extends HistoryProps, I extends InternalState> extends React.Component<W, I> {
  constructor(props, protected resourceService: ResourceService, protected alertError: (m: string, title?: string, detail?: string, callback?: () => void) => void, protected loading?: LoadingService) {
    super(props);
    this.back = this.back.bind(this);
    this.name = this.name.bind(this);
    this.updateState = this.updateState.bind(this);
    this.showError = this.showError.bind(this);
    this.showMessage = this.showMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.alertError = this.alertError.bind(this);
    this.ref = React.createRef();
  }
  protected _name = 'user';
  protected ref: any;
  protected form: any;
  protected alertClass = '';
  protected running: boolean;

  protected back(event: any): void {
    if (event) {
      event.preventDefault();
    }
    this.props.history.goBack();
  }
  protected name(): string {
    return this._name;
  }
  protected updateFlatState(e: any): void {
    const ctrl = e.currentTarget;
    const objSet = {};
    const n = ctrl.name;
    objSet[n] = ctrl.value;
    this.setState(objSet);
  }
  protected updateState(e: any): void {
    const n = this.name();
    const ctrl = e.currentTarget;
    const ex = this.state[n];
    const model = Object.assign({}, ex);
    model[ctrl.name] = ctrl.value;
    const objSet = {};
    objSet[n] = model;
    this.setState(objSet);
  }
  protected showMessage = (msg: string) => {
    this.alertClass = 'alert alert-info';
    this.setState({ message: msg });
  }
  protected showError = (msg: string) => {
    this.alertClass = 'alert alert-danger';
    this.setState({ message: msg });
  }
  protected hideMessage = () => {
    this.alertClass = '';
    this.setState({ message: '' });
  }

  handleError(err: any): void {
    this.running = false;
    if (this.loading) {
      this.loading.hideLoading();
    }
    const data: any = err.response ? err.response : err;
    const r = this.resourceService;
    const title = r.value('error');
    let msg = r.value('error_internal');
    if (!err) {
      this.alertError(msg, title);
      return;
    }
    const status = data.status;
    if (status && !isNaN(status)) {
      msg = messageByHttpStatus(status, r);
    }
    this.alertError(msg, title);
  }
}

export function messageByHttpStatus(status: number, r: ResourceService): string {
  let msg = r.value('error_internal');
  if (status === 401) {
    msg = r.value('error_unauthorized');
  } else if (status === 403) {
    msg = r.value('error_forbidden');
  } else if (status === 404) {
    msg = r.value('error_not_found');
  } else if (status === 410) {
    msg = r.value('error_gone');
  } else if (status === 503) {
    msg = r.value('error_service_unavailable');
  }
  return msg;
}
