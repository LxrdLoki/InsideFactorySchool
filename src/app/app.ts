import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('InsideFactory');

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getInfo();
  }
}
