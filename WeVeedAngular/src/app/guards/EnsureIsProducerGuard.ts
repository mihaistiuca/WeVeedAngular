import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class EnsureIsProducerGuard implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
        this.router.navigate(['login']);
        return false;
    }
    else if(this.authService.getUserType() != 'producer') {
        this.router.navigate(['not-accessable']);
        return false;
    }

    return true;
  }
}