import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
