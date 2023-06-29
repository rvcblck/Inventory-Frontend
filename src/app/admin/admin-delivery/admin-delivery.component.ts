import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { InventoryService } from 'src/app/service/inventory.service';
import { OrderService } from 'src/app/service/order.service';
import { UserService } from 'src/app/service/user.service';
import { ViewOrderComponent } from '../modal/view-order/view-order.component';

@Component({
  selector: 'app-admin-delivery',
  templateUrl: './admin-delivery.component.html',
  styleUrls: ['./admin-delivery.component.css']
})
export class AdminDeliveryComponent {
  orderData!: any;
  requestorData!: any;
  inventoryData!: any;
  usersData!: any;
  dateFilter = 'all';
  filteredDate!: string;
  loader = false;
  customFromDate: Date | null = null;
  customToDate: Date | null = null;
  searchTerm: string = '';
  filteredOrderData: any;
  viewOrder: any;

  displayedColumns: string[] = ['Status', 'Items', 'Address', 'Requestor Name', 'Release Date', 'Time', 'Action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    console.log(this.dataSource.filter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

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

    this.loader = true;
    forkJoin([this.dateFilter != 'all' ? this.orderService.indexFiltered(data) : this.orderService.index(), this.userService.index()]).subscribe(
      ([order, users]) => {
        this.loader = false;
        this.orderData = order.data;
        this.usersData = users.data;

        console.log(this.usersData);

        const admin_id = localStorage.getItem('admin_id');
        const orderData = this.orderData
          .map((item: any) => {
            const newArray = { ...item };

            if (newArray.order_list.length > 0) {
              const items = newArray ? newArray.order_list.length : '';
              newArray.item = items ? items : '';
            }

            const requestor = this.usersData.find((user: any) => user.id === item.to);
            if (requestor) {
              newArray.requestor_name = `${requestor.fname} ${requestor.lname}`;
              newArray.requestor_contact_no = requestor.contact_no;
              newArray.requestor_delivery_location = requestor.delivery_location;
              newArray.requestor_role = requestor.role.role;
            }

            const sender = this.usersData.find((user: any) => user.id === item.from);
            if (requestor) {
              newArray.sender_name = `${sender.fname} ${sender.lname}`;
              newArray.sender_delivery_location = sender.delivery_location;
              newArray.sender_contact_no = sender.contact_no;
              newArray.sender_role = sender.role.role;
            }

            return newArray;
          })
          .filter((user: any) => user.from === admin_id); //show orders from admin only

        this.filteredOrderData = orderData;

        console.log(this.filteredOrderData, 'here');

        this.dataSource = new MatTableDataSource(this.filteredOrderData);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  view(id: string) {
    const viewOrder = this.filteredOrderData.find((data: any) => data.orderId === id);

    // console.log(viewOrder);

    this.loader = false;
    const dialogRef = this.dialog.open(ViewOrderComponent, {
      data: { viewOrder: viewOrder },
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // this.getChildrenInfo();
      }
    });
  }
}
