import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HoverPreloadModule, HoverPreloadStrategy } from 'ngx-hover-preload';
import { HomeComponent } from './components/home/home.component';
import { UserResolver } from './resolvers/user.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'resolver',
    resolve: { users: UserResolver },
    loadComponent: () => import('./components/resolver-list/resolver-list.component').then(m => m.ResolverListComponent)
  },
  {
    path: 'resolver/:id',
    resolve: { user: UserResolver },
    loadComponent: () => import('./components/resolver-detail/resolver-detail.component').then(m => m.ResolverDetailComponent)
  },
  {
    path: 'standard',
    loadComponent: () => import('./components/standard-list/standard-list.component').then(m => m.StandardListComponent)
  },
  {
    path: 'standard/:id',
    loadComponent: () => import('./components/standard-detail/standard-detail.component').then(m => m.StandardDetailComponent)
  },
  {
    path: '404',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

@NgModule({
  imports: [
    HoverPreloadModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      preloadingStrategy: HoverPreloadStrategy,
      urlUpdateStrategy: 'eager',
    })
  ],
  exports: [HoverPreloadModule, RouterModule]
})
export class AppRoutingModule { }
