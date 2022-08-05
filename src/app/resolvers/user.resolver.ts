import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { DataService } from '../services/data.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User | User[]> {
  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot): Observable<User | User[]> {
    let value: Observable<User | User[]>;
    if (route.params['id']) {
      value = this.dataService.getUser(route.params['id']);
    } else {
      value = this.dataService.getUsers();
    }
    return value.pipe(catchError(() => {
      this.router.navigate(['/404'], { skipLocationChange: true });
      return EMPTY;
    }));
  }
}
