import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('InsideFactory');

  /*
    Code for testing API service and API functionality,
    To be edited to fit the actual API endpoints and functionality when they are ready.
  */

  // constructor(private apiService: ApiService) { }

  // ngOnInit(): void {
  //   this.apiService.getInfo();
  // }
}
