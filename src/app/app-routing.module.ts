import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ReadyPageGuard } from './guards/ready-page.guard';
import { AuthGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/basic-pages/login/login.module').then(m => m.LoginPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/basic-pages/register/register.module').then(m => m.RegisterPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'data-picker',
    loadChildren: () => import('./pages/basic-pages/data-picker/data-picker.module').then( m => m.DataPickerPageModule),
    canLoad: [ReadyPageGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./pages/news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'price-list',
    loadChildren: () => import('./pages/price-list/price-list.module').then( m => m.PriceListPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
