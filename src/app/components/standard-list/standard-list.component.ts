import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, EMPTY, map } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-standard-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './standard-list.component.html',
  styleUrls: ['./standard-list.component.scss']
})
export class StandardListComponent {
  users$ = this.dataService.getUsers().pipe(
    map(users => users.reverse()),
    catchError(() => {
      this.router.navigate(['/404'], { skipLocationChange: true });
      return EMPTY;
    })
  );

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }
}
