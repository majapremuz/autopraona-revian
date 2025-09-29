import { ValidatorFn, FormGroup, ValidationErrors, AsyncValidatorFn, AbstractControl } from '@angular/forms';

//import libphonenumbers from 'google-libphonenumber';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

export function get_country_code(){
    let countries: Array<any> = [];
    let phoneNumberUtil = PhoneNumberUtil.getInstance();
    let sup_reg = phoneNumberUtil.getSupportedRegions();

    sup_reg.map(item => {
        let code = phoneNumberUtil.getCountryCodeForRegion(item);
        let code_obj = {contry: item, code: code};
        countries.push(code_obj);
    });

    return countries;
}

export function get_country_code_from_number(number: any){
    const phoneUtil = PhoneNumberUtil.getInstance();

    let country_code = phoneUtil.parse(number, "");

    return {
        national_number: (country_code.getCountryCode() || '').toString(),
        number: (country_code.getNationalNumber() || '').toString()
    }

}

export function phone_validator() {

    return (fg: AbstractControl) => {

        // get data from form
        const country_num = fg.get('phone_code')?.value || '';
        const phone_input = fg.get('phone')?.value || '';
        const phone = country_num + phone_input;

        //const PNF = PhoneNumberFormat;
        const phoneUtil = PhoneNumberUtil.getInstance();
        const res = noExcepetion(() => (phoneUtil.parse(phone)));
        const valid = noExcepetion(() => (phoneUtil.isValidNumber(res)));

        if(valid != 'ERROR' && valid != false){
            fg.setErrors(null)
            //fg.controls['phone'].setErrors(null);
            return null;
        }
        else{
            fg.setErrors({'phoneInvalid': true})

            //fg.controls['phone'].setErrors({'phoneInvalid': true});
            return { number: true };
        }
    }
}

// export checkPasswords(password: string, confirmPassword: string):ValidatorFn {
//     return (formGroup: AbstractControl):{ [key: string]: any } | null => {
//       const passwordControl = formGroup.get(password);
//       const confirmPasswordControl = formGroup.get(confirmPassword);
      
//       if (!passwordControl || !confirmPasswordControl) {
//         return null;
//       }

//       if (
//         confirmPasswordControl.errors &&
//         !confirmPasswordControl.errors.passwordMismatch
//       ) {
//         return null;
//       }

//       if (passwordControl.value !== confirmPasswordControl.value) {
//         confirmPasswordControl.setErrors({ passwordMismatch: true });
//         return { passwordMismatch: true }
//       } else {
//         confirmPasswordControl.setErrors(null);
//         return null;
//       }
//     };
//   }

export const checkPasswords: ValidatorFn | any = (fg: FormGroup) => {

    const password = fg.get('password')?.value || '';
    const re_password = fg.get('re_password')?.value || '';

    if(password != re_password){
        fg.controls['re_password'].setErrors({ notSame : true});
        return { notSame : true};
    }
    else{
        fg.controls['re_password'].setErrors(null);
        return null;
    }
};

// export function checkPasswords_old() {

//     return (fg: FormGroup) => {
  
//       const password = fg.get('password').value;
//       const re_password = fg.get('re_password').value;


//       fg.controls['re_password'].setErrors( (password !=
//          re_password ? { notSame : true} : null) );

//       if(password != re_password){
//         return { notSame : true};
//       }
//       else{
//         return null;
//       }
//     }
// }


export function createPasswordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

        return !passwordValid ? {passwordStrength:true}: null;
    }
}

export function get_valid_number(country: any, phone: any){
    const PNF = PhoneNumberFormat;
    const phoneUtil = PhoneNumberUtil.getInstance();
    const full_phone = country + phone;

    const res = noExcepetion(() => (phoneUtil.parse(full_phone)));

    if(res != 'ERROR'){
        return noExcepetion(() => (phoneUtil.format(res, PNF.E164)));
    }
    else{
        return 'ERROR';
    }

}

function noExcepetion(func: any) {
    let ret;
    try {
        ret = func();
    } catch (err) {
        ret = 'ERROR';
    } finally {
        return ret;
    }
}