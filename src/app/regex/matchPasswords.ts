import { AbstractControl, ValidationErrors } from "@angular/forms";

export const matchPasswords = (group: AbstractControl): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  // if passwords don't match, set error on confirmPassword field
  if (password !== confirmPassword) {
    group.get('confirmPassword')?.setErrors({ matchPasswords: true });
    return { matchPasswords: true };
  }

  group.get('confirmPassword')?.setErrors(null);
  return null;
};
