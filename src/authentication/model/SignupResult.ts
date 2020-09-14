import {ErrorMessage} from './ErrorMessage';
import {SignupStatus} from './SignupStatus';

export interface SignupResult {
  status: SignupStatus;
  message: string;
  errors: ErrorMessage[];
}
