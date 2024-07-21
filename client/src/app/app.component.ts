import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);

  protected title: string = 'Traveler';
  protected users: any;

  public async ngOnInit() {
    this.users = await firstValueFrom(
      this.http.get('https://localhost:5001/api/users')
    );
    console.log(this.users);
  }
}
