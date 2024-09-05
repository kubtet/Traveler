import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ExampleComponent } from './example/example.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'example', component: ExampleComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
