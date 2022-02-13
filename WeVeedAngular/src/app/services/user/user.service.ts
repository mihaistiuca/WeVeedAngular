import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IsEmailUniqueInput } from '../../generated-models/IsEmailUniqueInput';
import { Observable } from 'rxjs';
import { IsProducerNameUniqueInput } from '../../generated-models/IsProducerNameUniqueInput';
import { UserRegisterInput } from '../../generated-models/UserRegisterInput';
import { BaseResponse } from '../../basic-models/BaseResponse';
import { UserLoginInput } from '../../generated-models/UserLoginInput';
import { UserAuthenticateDto } from '../../generated-models/UserAuthenticateDto';
import { UserBasicInfoDto } from '../../generated-models/UserBasicInfoDto';
import { UserUpdateInfoInput } from '../../generated-models/UserUpdateInfoInput';
import { UserBecomeProducerInput } from '../../generated-models/UserBecomeProducerInput';
import { IsLoggedProducerNameUniqueInput } from '../../generated-models/IsLoggedProducerNameUniqueInput';
import { ProducerUpdateInfoInput } from '../../generated-models/ProducerUpdateInfoInput';
import { UserVerifyRegisterFacebookInput } from '../../generated-models/UserVerifyRegisterFacebookInput';
import { UserVerifyFacebookRegisterDto } from '../../generated-models/UserVerifyFacebookRegisterDto';
import { UserFBRegisterInput } from '../../generated-models/UserFBRegisterInput';
import { ProducerViewDto } from '../../generated-models/ProducerViewDto';
import { UserLoginWithFBInput } from '../../generated-models/UserLoginWithFBInput';
import { ConfirmAccountInput } from '../../generated-models/ConfirmAccountInput';
import { UserBecomeProducerDto } from '../../generated-models/UserBecomeProducerDto';
import { ValidateProducerByAdminInput } from '../../generated-models/ValidateProducerByAdminInput';
import { ResetPasswordInput } from '../../generated-models/ResetPasswordInput';
import { ResetPasswordSendEmailInput } from '../../generated-models/ResetPasswordSendEmailInput';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public gets() {
    this.http.get('/user/321')
      .subscribe(
        data => {
        },
        err => {
        }
      )
  }

  public validateProducerByAdmin(input: ValidateProducerByAdminInput): any {
    return this.http.post('/user/validateProducerByAdmin', input);
  }

  public getBasicInfoById(): Observable<BaseResponse<UserBasicInfoDto>> {
    return this.http.get<BaseResponse<UserBasicInfoDto>>('/user/GetUserInfo');
  }

  public isEmailUnique(input: IsEmailUniqueInput): any {
    return this.http.post('/user/isEmailUnique', input);
  }

  public isProducerNameUnique(input: IsProducerNameUniqueInput): any {
    return this.http.post('/user/isProducerNameUnique', input);
  }

  public isLoggedProducerNameUnique(input: IsLoggedProducerNameUniqueInput): any {
    return this.http.post('/user/isLoggedProducerNameUnique', input);
  }

  public register(input: UserRegisterInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/user/register', input);
  }

  public registerWithFacebook(input: UserFBRegisterInput): Observable<BaseResponse<UserBasicInfoDto>> {
    return this.http.post<BaseResponse<UserBasicInfoDto>>('/user/registerWithFacebook', input);
  }

  public login(input: UserLoginInput): Observable<BaseResponse<UserBasicInfoDto>> {
    return this.http.post<BaseResponse<UserBasicInfoDto>>('/user/login', input);
  }

  public loginWithFacebook(input: UserLoginWithFBInput): Observable<BaseResponse<UserVerifyFacebookRegisterDto>> {
    return this.http.post<BaseResponse<UserVerifyFacebookRegisterDto>>('/user/loginWithFacebook', input);
  }

  public updateUserInfo(input: UserUpdateInfoInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/user/updateUserInfo', input);
  }

  public updateProducerInfo(input: ProducerUpdateInfoInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/user/updateProducerInfo', input);
  }

  public becomeProducer(input: UserBecomeProducerInput): Observable<BaseResponse<UserBecomeProducerDto>> {
    return this.http.post<BaseResponse<UserBecomeProducerDto>>('/user/becomeProducer', input);
  }

  // for producer page 
  public getProducerViewInfo(producerId: string): Observable<BaseResponse<ProducerViewDto>> {
    return this.http.get<BaseResponse<ProducerViewDto>>('/user/getProducerViewInfo/' + producerId);
  }

  // do not forget to delete this 
  public test(): Observable<BaseResponse<string>> {
    return this.http.get<BaseResponse<string>>('/user/test');
  }

  public verifyRegisterWithFacebook(input: UserVerifyRegisterFacebookInput): Observable<BaseResponse<UserVerifyFacebookRegisterDto>> {
    return this.http.post<BaseResponse<UserVerifyFacebookRegisterDto>>('/user/verifyRegisterWithFacebook', input);
  }

  public confirmAccount(input: ConfirmAccountInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/user/confirmAccount', input);
  }

  public resetPassword(input: ResetPasswordInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/user/resetPassword', input);
  }

  public resetPasswordSendEmail(input: ResetPasswordSendEmailInput): Observable<BaseResponse> {
    return this.http.post<BaseResponse>('/user/resetPasswordSendEmail', input);
  }
  
}
