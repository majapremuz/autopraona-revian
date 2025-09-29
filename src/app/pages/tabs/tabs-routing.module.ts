import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { ReadyPageGuard } from '../../guards/ready-page.guard';
import { AuthGuard } from '../../guards/login.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'orders',
        loadChildren: () => import('../orders/orders.module').then(m => m.OrdersPageModule),
        canLoad: [ReadyPageGuard]
      },
      {
        path: 'price-list',
        loadChildren: () => import('../price-list/price-list.module').then(m => m.PriceListPageModule),
        canLoad: [ReadyPageGuard]
      },
      {
        path: 'news',
        loadChildren: () => import('../news/news.module').then(m => m.NewsPageModule),
        canLoad: [ReadyPageGuard]
      },
      {
        path: 'company',
        loadChildren: () => import('../basic-pages/company/company.module').then( m => m.CompanyPageModule),
        canLoad: [ReadyPageGuard]
      },
      {
        path: 'my-data',
        children: [
          {        
            path: '',
            loadChildren: () => import('../basic-pages/my-data/my-data.module').then(m => m.MyDataPageModule),
            canLoad: [ReadyPageGuard],
            canActivate: [AuthGuard]
          },
          {
            path: 'edit-data',
            loadChildren: () => import('../basic-pages/edit-data/edit-data.module').then( m => m.EditDataPageModule),
            canLoad: [ReadyPageGuard],
            canActivate: [AuthGuard]
          },
          {
            path: 'edit-password',
            loadChildren: () => import('../basic-pages/edit-password/edit-password.module').then( m => m.EditPasswordPageModule),
            canLoad: [ReadyPageGuard],
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
