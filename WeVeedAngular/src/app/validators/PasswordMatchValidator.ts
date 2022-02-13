import {AbstractControl} from '@angular/forms';

export class PasswordMatchValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('password').value; // to get value in input tag
       let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if(password != confirmPassword) {
            AC.get('confirmPassword').setErrors( { matchpassword: true } );
        } else {
            return null
        }
    }
}