import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicLayoutComponent } from './public/public-layout/public-layout.component';
import { HomeComponent } from './public/home/home.component';
import { LoginComponent } from './public/login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { RequestorLayoutComponent } from './requestor/requestor-layout/requestor-layout.component';
import { RequestorDashboardComponent } from './requestor/requestor-dashboard/requestor-dashboard.component';
import { WarehouseLayoutComponent } from './warehouse/warehouse-layout/warehouse-layout.component';
import { WarehouseDashboardComponent } from './warehouse/warehouse-dashboard/warehouse-dashboard.component';
import { AdminGuard } from './admin.guard';
import { RequestorGuard } from './requestor.guard';
import { WarehouseGuard } from './warehouse.guard';
import { RequestorMarketComponent } from './requestor/requestor-market/requestor-market.component';
import { RequestorAboutComponent } from './requestor/requestor-about/requestor-about.component';
import { AdminInventoryComponent } from './admin/admin-inventory/admin-inventory.component';
import { AdminRequestComponent } from './admin/admin-request/admin-request.component';
import { AdminDeliveryComponent } from './admin/admin-delivery/admin-delivery.component';
import { AdminAccountsComponent } from './admin/admin-accounts/admin-accounts.component';
import { SupplierMarketComponent } from './admin/supplier-market/supplier-market.component';
import { RequestorRequestComponent } from './requestor/requestor-request/requestor-request.component';
import { SupplierLayoutComponent } from './supplier/supplier-layout/supplier-layout.component';
import { SupplierGuard } from './supplier.guard';
import { SupplierRequestComponent } from './supplier/supplier-request/supplier-request.component';
import { SupplierDeliveryComponent } from './supplier/supplier-delivery/supplier-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
        data: {
          title: 'Login'
        }
      },
      {
        path: '',
        component: HomeComponent,
        data: {
          title: 'Home'
        }
      },
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login'
        }
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'dashboard',
        component: AdminDashboardComponent,
        canActivate: [AdminGuard],
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'request',
        component: AdminRequestComponent,
        canActivate: [AdminGuard],
        data: {
          title: 'Request'
        }
      },
      {
        path: 'supplier-market',
        component: SupplierMarketComponent,
        canActivate: [AdminGuard],
        data: {
          title: 'Suppler Market'
        }
      },
      {
        path: 'inventory',
        component: AdminInventoryComponent,
        canActivate: [AdminGuard],
        data: {
          title: 'Inventory'
        }
      },
      {
        path: 'delivery',
        component: AdminDeliveryComponent,
        canActivate: [AdminGuard],
        data: {
          title: 'Delivery'
        }
      },
      {
        path: 'accounts',
        component: AdminAccountsComponent,
        canActivate: [AdminGuard],
        data: {
          title: 'Accounts'
        }
      }
    ]
  },
  {
    path: 'requestor',
    component: RequestorLayoutComponent,
    canActivate: [RequestorGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'dashboard',
        component: RequestorDashboardComponent,
        canActivate: [RequestorGuard],
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'request',
        component: RequestorRequestComponent,
        canActivate: [RequestorGuard],
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'products',
        component: RequestorMarketComponent,
        canActivate: [RequestorGuard],
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'about',
        component: RequestorAboutComponent,
        canActivate: [RequestorGuard],
        data: {
          title: 'Dashboard'
        }
      }
    ]
  },
  {
    path: 'warehouse',
    component: WarehouseLayoutComponent,
    canActivate: [WarehouseGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'dashboard',
        component: WarehouseDashboardComponent,
        canActivate: [WarehouseGuard],
        data: {
          title: 'Dashboard'
        }
      }
    ]
  },
  {
    path: 'supplier',
    component: SupplierLayoutComponent,
    canActivate: [SupplierGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'dashboard',
        component: SupplierLayoutComponent,
        canActivate: [SupplierGuard],
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'request',
        component: SupplierRequestComponent,
        canActivate: [SupplierGuard],
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'delivery',
        component: SupplierDeliveryComponent,
        canActivate: [SupplierGuard],
        data: {
          title: 'Dashboard'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
