import * as moment from 'moment';
import {Locale, LocaleFormatter} from 'onecore';
import {UserType} from '../enum/UserType';

export class BusinessSearchModelFormatter<T> implements LocaleFormatter<T> {
  format(obj2: T, locale: Locale): T {
    const formatDateString = locale.dateFormat.toUpperCase() + ' HH:mm:ss';
    const obj: any = obj2;

    if (obj.ctrlStatus) {
      const v = obj.ctrlStatus;
      if (v === 'A') {
        obj.ctrlStatusName = 'Approved';
      } else if (v === 'R') {
        obj.ctrlStatusName = 'Rejected';
      } else if (v === 'P') {
        obj.ctrlStatusName = 'Pending';
      }
    }

    if (obj.actionStatus) {
      const v = obj.actionStatus;
      if (v === 'C') {
        obj.actionStatus = 'Created';
      } else if (v === 'U') {
        obj.actionStatus = 'Updated';
      } else {
        obj.actionStatus = 'Deleted';
      }
    }

    if (obj.createdDate) {
      obj.createdDate = this.formatDate(obj.createdDate, 'DD.MM.YYYY hh:mm:ss');
    } else if (obj.createdDate) {
      obj.createdDate = this.formatDate(obj.createdDate, 'DD.MM.YYYY hh:mm:ss');
    }

    if (obj.paymentDate) {
      obj.paymentDate = this.formatDate(obj.paymentDate, 'DD.MM.YYYY hh:mm:ss');
    }

    if (obj.actionDate) {
      obj.actionDate = this.formatDate(obj.actionDate, formatDateString);
    }

    if (obj.receiveDate) {
      obj.receiveDate = this.formatDate(obj.receiveDate, 'DD.MM.YYYY hh:mm:ss');
    }

    if (obj.activate) {
      if (obj.activate === 'T') {
        obj.activate = 'Activated';
      } else if (obj.activate === 'F') {
        obj.activate = 'Deactivated';
      }
    }

    if (obj.activateFlag) {
      if (obj.activateFlag === 'T') {
        obj.activateFlag = 'Activated';
      } else {
        obj.activateFlag = 'Deactivated';
      }
    }

    if (obj.webServicesType) {
      obj.webServicesType = obj.webServicesType === 'HO' ? 'Hold' : '';
    }

    return obj;
  }

  private formatDate(date, format: string): string {
    if (!date || date === '') {
      return '';
    }
    return moment(date).format(format);
  }
}
