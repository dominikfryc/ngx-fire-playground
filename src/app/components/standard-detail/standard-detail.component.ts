import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-standard-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standard-detail.component.html',
  styleUrls: ['./standard-detail.component.scss']
})
export class StandardDetailComponent {
  user$ = this.route.params.pipe(
    switchMap(params => this.dataService.getUser(params["id"])),
    catchError(() => {
      this.router.navigate(['/404'], { skipLocationChange: true });
      return EMPTY;
    })
  );

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) { }
}
