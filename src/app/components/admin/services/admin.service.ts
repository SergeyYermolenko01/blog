import {Injectable} from '@angular/core';
//import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {
  }
  //constructor() {
  //}

  getPersonalList(){

    return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users?_start=0&_limit=4');
    //return new Observable();
  }

  getPerson(id: number) {
    return this.http.get<User>(`https://jsonplaceholder.typicode.com/users/${id}`);
    //return new Observable();
  }
}
