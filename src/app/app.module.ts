import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { QRCodeModule } from 'angularx-qrcode';

// material
import { MatDialogModule, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './public/home/home.component';
import { LoginComponent } from './public/login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { PublicLayoutComponent } from './public/public-layout/public-layout.component';
import { RequestorLayoutComponent } from './requestor/requestor-layout/requestor-layout.component';
import { WarehouseLayoutComponent } from './warehouse/warehouse-layout/warehouse-layout.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { RequestorDashboardComponent } from './requestor/requestor-dashboard/requestor-dashboard.component';
import { WarehouseDashboardComponent } from './warehouse/warehouse-dashboard/warehouse-dashboard.component';
import { ConfirmComponent } from './modal/confirm/confirm.component';
import { RequestorMarketComponent } from './requestor/requestor-market/requestor-market.component';
import { RequestorAboutComponent } from './requestor/requestor-about/requestor-about.component';
import { AdminInventoryComponent } from './admin/admin-inventory/admin-inventory.component';
import { AdminRequestComponent } from './admin/admin-request/admin-request.component';
import { AdminDeliveryComponent } from './admin/admin-delivery/admin-delivery.component';
import { AdminAccountsComponent } from './admin/admin-accounts/admin-accounts.component';
import { ProcessRequestComponent } from './requestor/modal/process-request/process-request.component';
import { RequestorRequestComponent } from './requestor/requestor-request/requestor-request.component';
import { RequestorDeliveryComponent } from './requestor/requestor-delivery/requestor-delivery.component';
import { WarningComponent } from './modal/warning/warning.component';
import { ViewOrderComponent } from './admin/modal/view-order/view-order.component';
import { EditAddInventoryComponent } from './admin/modal/edit-add-inventory/edit-add-inventory.component';
import { SupplierMarketComponent } from './admin/supplier-market/supplier-market.component';
import { SupplierLayoutComponent } from './supplier/supplier-layout/supplier-layout.component';
import { SupplierDashboardComponent } from './supplier/supplier-dashboard/supplier-dashboard.component';
import { SupplierRequestComponent } from './supplier/supplier-request/supplier-request.component';
import { SupplierDeliveryComponent } from './supplier/supplier-delivery/supplier-delivery.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminLayoutComponent,
    PublicLayoutComponent,
    RequestorLayoutComponent,
    WarehouseLayoutComponent,
    AdminDashboardComponent,
    RequestorDashboardComponent,
    WarehouseDashboardComponent,
    ConfirmComponent,
    RequestorMarketComponent,
    RequestorAboutComponent,
    AdminInventoryComponent,
    AdminRequestComponent,
    AdminDeliveryComponent,
    AdminAccountsComponent,
    ProcessRequestComponent,
    RequestorRequestComponent,
    RequestorDeliveryComponent,
    WarningComponent,
    ViewOrderComponent,
    EditAddInventoryComponent,
    SupplierMarketComponent,
    SupplierLayoutComponent,
    SupplierDashboardComponent,
    SupplierRequestComponent,
    SupplierDeliveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ToastrModule.forRoot(),
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    QRCodeModule
  ],
  providers: [CookieService, MatDialogConfig, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
