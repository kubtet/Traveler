import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ExampleComponent } from './example/example.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { authGuard } from './guards/auth.guard';
import { SettingsComponent } from './settings/settings.component';
import { preventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TravelDetailComponent } from './travels/travel-detail/travel-detail.component';
import { TravelAddComponent } from './travels/travel-add/travel-add.component';
import { SearchComponent } from './search/search.component';
import { MessagesComponent } from './messages/messages.component';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { NotificationsComponent } from './notifications/notifications.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
      { path: 'example', component: ExampleComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'search', component: SearchComponent },
      {
        path: 'settings',
        component: SettingsComponent,
        canDeactivate: [preventUnsavedChangesGuard],
      },
      { path: 'travel/add', component: TravelAddComponent },
      { path: 'travel/:id', component: TravelDetailComponent },
      { path: 'user-profile/:id', component: UserProfileComponent },
    ],
  },
  { path: 'errors', component: TestErrorsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
