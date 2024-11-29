import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DigitCapitalValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';

    const hasDigit = /\d/.test(value);
    const hasCapitalLetter = /[A-Z]/.test(value);

    if (!hasDigit || !hasCapitalLetter) {
      return { digitAndCapital: true };
    }

    return null;
  };
}
