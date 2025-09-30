import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ReadyPageGuard } from './guards/ready-page.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
  },
  {
    path: 'cijenik',
    loadChildren: () => import('./pages/cijenik/cijenik.module').then( m => m.CijenikPageModule),
  },
  {
    path: 'kontakt',
    loadChildren: () => import('./pages/kontakt/kontakt.module').then( m => m.KontaktPageModule),
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profil/profil.module').then( m => m.ProfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit',
    loadChildren: () => import('./pages/edit/edit.module').then( m => m.EditPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'add-car',
    loadChildren: () => import('./pages/add-car/add-car.module').then( m => m.AddCarPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'vijesti',
    loadChildren: () => import('./pages/vijesti/vijesti.module').then( m => m.VijestiPageModule)
  },
  {
    path: 'categories/:id',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule),
  },
  {
    path: 'text/:id',
    loadChildren: () => import('./pages/text/text.module').then( m => m.TextPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then( m => m.OrderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-chemical',
    loadChildren: () => import('./pages/order-chemical/order-chemical.module').then( m => m.OrderChemicalPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
