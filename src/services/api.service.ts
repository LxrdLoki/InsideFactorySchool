import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  public getInfo() {
    this.http.get('http://localhost:3000/', { responseType: 'text' })
      .subscribe(res => {
        console.log(res), "moi";
      });
  }

  public getCalendarData() {
    let data = null;
    this.http.get('http://localhost:3000/calendar', { responseType: 'json' })
      .subscribe(res => {
        console.log(res, "calendarData");
        data = res;
      });

    if (!data) {
      console.error("No data received from the server");
      return;
    }

    return data;
  }
}
