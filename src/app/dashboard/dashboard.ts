import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CalendarEvent } from '../../types/calendar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public calendarData = signal<CalendarEvent[] | undefined>(undefined);

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getCalendarData(0).subscribe((data) => {
      this.calendarData.set(data);
      console.log(data);
    });
  }
}
