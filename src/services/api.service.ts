import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CalendarEvent } from "../types/calendar";
import { Observable } from "rxjs";
import { insiderTransaction } from "../types/insideTransactions";
import { User } from "../types/user";
import { AuthResponse } from "../types/authResponse";

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  public getCalendarData(week: number): Observable<CalendarEvent[]> {
    return this.http.get<CalendarEvent[]>(`http://localhost:3000/calendar/${week}`);
  }

  public getInsiderTransactions(): Observable<insiderTransaction[]> {
    return this.http.get<insiderTransaction[]>(`http://localhost:3000/insiderTrades`);
  }

  public loginUser(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`http://localhost:3000/login`, { email, password });
  }

  public registerUser(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`http://localhost:3000/register`, { username, email, password });
  }

  public createPost(title: string, subject: string, text: string): Observable<any> {
    const token = localStorage.getItem("token");
    return this.http.post(`http://localhost:3000/forum/createPost`, { title, subject, text }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  public getForumPosts(category: string): Observable<any> {
    return this.http.get(`http://localhost:3000/forum/${category.toUpperCase()}`);
  }
}
