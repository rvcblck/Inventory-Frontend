import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RequestService } from 'src/app/service/request.service';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { InventoryService } from 'src/app/service/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/service/order.service';
import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { WarningComponent } from 'src/app/modal/warning/warning.component';

@Component({
  selector: 'app-warehouse-orders',
  templateUrl: './warehouse-orders.component.html',
  styleUrls: ['./warehouse-orders.component.css']
})
export class WarehouseOrdersComponent {
  orderData!: any;
  requestorData!: any;
  inventoryData!: any;
  usersData!: any;
  dateFilter = 'this_day';
  filteredDate!: string;
  loader = false;
  customFromDate: Date | null = null;
  customToDate: Date | null = null;
  incompleteOrderData!: any;
  completeOrderData!: any;
  declineRequestorData!: any;
  selectedTabIndex: number = 0;

  filteredRequestItems: any[] = [];
  isError = false;
  searchTerm: string = '';
  pendingorderData!: any[];
  completeItems: any[] = [];

  constructor(
    private requestService: RequestService,
    private userService: UserService,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private dialog: MatDialog
  ) {
    this.index();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}

  index(): void {
    const currentDate = new Date();
    const thirtyDaysBefore = new Date();
    thirtyDaysBefore.setDate(currentDate.getDate() - 30);

    let data: any = {};

    switch (this.dateFilter) {
      case 'this_day':
        data.date_from = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
        data.date_to = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });

        break;
      case 'this_week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(currentDate.getDate() - 7);
        data.date_from = oneWeekAgo.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
        data.date_to = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });

        break;
      case 'this_month':
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        data.date_from = firstDayOfMonth.toLocaleString('en-US', { timeZone: 'Asia/Manila' });

        data.date_to = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });

        break;
      case 'all':
        break;
      case 'custom':
        if (this.customFromDate && this.customToDate) {
          data.date_from = this.customFromDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
          data.date_to = this.customToDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
        }
        break;
      default:
        break;
    }

    // console.log(data);

    this.loader = true;
    forkJoin([
      this.dateFilter != 'all' ? this.orderService.indexFiltered(data) : this.orderService.index(),
      this.userService.index(),
      this.inventoryService.index()
    ]).subscribe(
      ([request, users, inventory]) => {
        this.loader = false;
        this.orderData = request.data;
        this.usersData = users.data;
        this.inventoryData = inventory.data;
        this.filteredRequestItems = [];

        console.log(this.orderData);

        this.completeOrderData = this.filterRequestorData(this.orderData);
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  filterRequestorData(orderData: any[]) {
    const user_id = localStorage.getItem('admin_id');

    const filteredData = orderData
      .filter((item: any) => item.from === user_id && item.release_date === null)
      .map((item: any) => {
        item.item = item.order_list.length;
        return item;
      })
      .sort((a: any, b: any) => a.order_number - b.order_number);

    const filteredDataWithItems = filteredData.filter((item: any) => item.order_list.length > 0);

    console.log(`Filtered Data`, filteredDataWithItems);

    return filteredDataWithItems;
  }

  performSearch() {
    console.log(this.searchTerm);
    console.log(this.completeOrderData);
    if (this.searchTerm === '') {
      this.completeOrderData = this.filterRequestorData(this.orderData);
    }
    this.completeOrderData = this.completeOrderData.filter((item: any) => item.order_number.toString().includes(this.searchTerm.toString()));
  }

  completeFilterOrderData(order_id: number) {
    const filteredRequest = this.completeOrderData.find((item: any) => item.order_id === order_id);
    this.filteredRequestItems = filteredRequest ? filteredRequest.order_list : [];

    this.filteredRequestItems = this.filteredRequestItems.map((requestItem) => {
      const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

      return {
        ...requestItem,
        item_name: item ? item.item_name : '',
        item_image_url: item ? item.item_image_url : '',
        // request_approved: requestItem.request_approved,
        item_quantity: item ? item.item_quantity : '',
        item_price: item ? item.item_price : ''
      };
    });
  }

  releaseOrderConfirm() {
    const message = `Are you sure you want to release this order?`;
    const header = `Release Order`;
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        header: header,
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // The user confirmed the action, submit the form
        this.releaseOrder();
      }
    });
  }

  releaseOrder() {
    const order_id = this.filteredRequestItems[0].order_id;

    const formData = new FormData();

    const currentDate = new Date();

    const releaseDate = currentDate.toLocaleString('en-US', { timeZone: 'Asia/Manila' });

    formData.append('order_status', 'Out For Delivery');
    formData.append('release_date', releaseDate);

    formData.forEach((value: FormDataEntryValue, key: string) => {
      console.log(key + ' - ' + value);
    });

    this.orderService.update(formData, order_id).subscribe(
      (response) => {
        this.index();
        this.toastr.success('Order Release', 'Success');
      },
      (err) => {
        this.index();
        this.toastr.error('Order Release', 'Failed');
        console.log(err);
      }
    );
  }
}
