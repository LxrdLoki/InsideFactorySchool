import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CalendarEvent } from "../types/calendar";
import { Observable } from "rxjs";
import { insiderTransaction } from "../types/insideTransactions";
import { User } from "../types/user";

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  public getCalendarData(week: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`http://localhost:3000/calendar/${week}`);
  }

  public getInsiderTransactions(): Observable<insiderTransaction[]> {
    return this.http.get<insiderTransaction[]>(`http://localhost:3000/insiderTrades`);
  }

  public registerUser(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`http://localhost:3000/register`, { username, email, password });
  }
}
