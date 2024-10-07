import { CanDeactivateFn } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<SettingsComponent> = (
  component
) => {
  if (component.form.dirty) {
    return confirm(
      'Are you sure to leave the page? Unsaved changes will be lost.'
    );
  }
  return true;
};
