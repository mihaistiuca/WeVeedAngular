import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Injectable, ValueProvider, Inject } from '@angular/core';
// import { tokenNotExpired } from 'angular2-jwt';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserAuthenticateDto } from '../../generated-models/UserAuthenticateDto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(@Inject(WINDOW) private window: Window, @Inject(LOCAL_STORAGE) private localStorage: any, public jwtHelper: JwtHelperService) { }

  public getToken(): string {
    return this.localStorage.getItem('token');
  }

  public setToken(token: string): void {
    this.localStorage.setItem('token', token);
  }

  public isAuthenticated(): boolean {
    try {
      const token = this.getToken();
      return !this.jwtHelper.isTokenExpired(token);
    }
    catch {
      this.setToken(null);
      return false;
    }
  }

  public logout(): void {
    this.localStorage.removeItem('token');
  }

  public getUserId(): string {
    let token = this.getToken();
    if (!token) {
      return null;
    }

    try{
      let jwtData = token.split('.')[1];
      let decodedJwtJsonData = this.window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);

      return decodedJwtData.userid;
    }
    catch{
      return null;
    }
  }

  public getUserType(): string {
    let token = this.getToken();
    if (!token) {
      return null;
    }

    try{
      let jwtData = token.split('.')[1];
      let decodedJwtJsonData = this.window.atob(jwtData);
      let decodedJwtData = JSON.parse(decodedJwtJsonData);

      return decodedJwtData.usertype;
    }
    catch{
      return null;
    }
  }
}
