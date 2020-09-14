import {SignupInfo} from '../model/SignupInfo';
import {SignupResult} from '../model/SignupResult';

export interface SignupService {
  signup(user: SignupInfo): Promise<SignupResult>;
}
