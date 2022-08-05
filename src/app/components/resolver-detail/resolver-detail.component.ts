import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-resolver-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resolver-detail.component.html',
  styleUrls: ['./resolver-detail.component.scss']
})
export class ResolverDetailComponent {
  user$ = this.route.data.pipe(map(data => data['user'] as User));

  constructor(private route: ActivatedRoute) { }
}
