import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AccountService } from '../services/account.service';
import { LoginComponent } from "../account/login/login.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgFor, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  protected accountService = inject(AccountService);
  private http = inject(HttpClient);

  protected users: any;

  public async ngOnInit() {
    this.users = await firstValueFrom(
      this.http.get('https://localhost:5001/api/users')
    );
    console.log(this.users);
  }
}
