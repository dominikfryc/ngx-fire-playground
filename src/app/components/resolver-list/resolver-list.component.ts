import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-resolver-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resolver-list.component.html',
  styleUrls: ['./resolver-list.component.scss']
})
export class ResolverListComponent {
  users$ = this.route.data.pipe(map(data => data['users'] as User[]));

  constructor(private route: ActivatedRoute) { }
}
