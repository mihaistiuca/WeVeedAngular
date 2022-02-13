import { AbstractControl } from '@angular/forms';
import { UserService } from '../services/user/user.service';
import { IsEmailUniqueInput } from '../generated-models/IsEmailUniqueInput';

export class IsEmailUniqueValidator {

    static createValidator(userService: UserService) {
        return (control: AbstractControl) => {
            return userService.isEmailUnique({ email: control.value } as IsEmailUniqueInput)
                .subscribe(
                    data => {
                        return null;
                    },
                    err => {
                        return { emailUniqueError: true };
                    }
                )
        }
    }
}