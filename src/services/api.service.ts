import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  getInfo() {
    this.http.get('http://localhost:3000/', { responseType: 'text' })
      .subscribe(res => {
        console.log(res), "moi";
      });
  }
}
