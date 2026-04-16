import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CalendarEvent } from '../../types/calendar';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  public calendarData: CalendarEvent[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getCalendarData().subscribe((data) => {
      this.calendarData = data;
      console.log(data);
    });
  }
}
