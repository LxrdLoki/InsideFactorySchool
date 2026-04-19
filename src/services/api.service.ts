import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CalendarEvent } from "../types/calendar";
import { Observable } from "rxjs";
import { insiderTransaction } from "../types/insideTransactions";

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  public getCalendarData(week: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`http://localhost:3000/calendar/${week}`);
  }

  public getInsiderTransactions(): Observable<insiderTransaction[]> {
    return this.http.get<insiderTransaction[]>(`http://localhost:3000/insiderTrades`);
  }
}
