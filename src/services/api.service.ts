import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CalendarEvent } from "../types/calendar";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  // public getInfo() {
  //   this.http.get('http://localhost:3000/', { responseType: 'text' })
  //     .subscribe(res => {
  //       console.log(res);
  //     });
  // }

  public getCalendarData(week: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`http://localhost:3000/calendar/${week}`);
  }
}
