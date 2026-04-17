import { Component, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CalendarEvent } from '../../types/calendar';
import { CommonModule } from '@angular/common';
import { insiderTransaction } from '../../types/insideTransactions';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public calendarData = signal<CalendarEvent[] | undefined>(undefined);
  public insiderTransactions = signal<insiderTransaction[] | undefined>(undefined);
  public weekToGet = 0;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {

    //TODO: get appropiate date/ time format for display
    this.apiService.getCalendarData(this.weekToGet).subscribe((data) => {
      this.calendarData.set(data);
    });
    this.apiService.getInsiderTransactions().subscribe((data) => {
      this.insiderTransactions.set(data);
    });

  }

  //TODO: think of good functionality for text in the middle, maybe button back to current week or displaying where the user is at in date
  public arrowClick(value: "previous" | "next") {
    value === "previous" ? this.weekToGet-- : this.weekToGet++;
    this.apiService.getCalendarData(this.weekToGet).subscribe((data) => {
      this.calendarData.set(data);
    });
  }
}
