import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ExampleComponent } from './example/example.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'example', component: ExampleComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
