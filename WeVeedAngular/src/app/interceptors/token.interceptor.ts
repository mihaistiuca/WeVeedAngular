import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    var authorizationToken = `Bearer ${this.authService.getToken()}`;
    const headers = new HttpHeaders({
        'Authorization': authorizationToken,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Accept': 'application/json'
    })

    request = request.clone(
        {
            headers: headers, 
            url: 'https://weveedapi.com' + request.url
            // url: 'http://weveedwebapi-test.eu-central-1.elasticbeanstalk.com' + request.url
            // url: 'http://localhost:63552' + request.url
        });

    return next.handle(request);
  }
}