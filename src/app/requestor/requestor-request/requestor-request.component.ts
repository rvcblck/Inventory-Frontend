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
  selector: 'app-requestor-request',
  templateUrl: './requestor-request.component.html',
  styleUrls: ['./requestor-request.component.css']
})
export class RequestorRequestComponent implements OnInit, AfterViewInit {
  requestData!: any;
  requestorData!: any;
  inventoryData!: any;
  usersData!: any;
  dateFilter = 'this_day';
  filteredDate!: string;
  loader = false;
  customFromDate: Date | null = null;
  customToDate: Date | null = null;
  incompleteRequestorData!: any;
  completeRequestorData!: any;
  declineRequestorData!: any;
  selectedTabIndex: number = 0;

  filteredRequestItems: any[] = [];
  isError = false;
  searchTerm: string = '';
  pendingRequestData!: any[];
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

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
      this.dateFilter != 'all' ? this.requestService.indexFiltered(data) : this.requestService.index(),
      this.userService.index(),
      this.inventoryService.index()
    ]).subscribe(
      ([request, users, inventory]) => {
        this.loader = false;
        this.requestData = request.data;
        this.usersData = users.data;
        this.inventoryData = inventory.data;
        this.filteredRequestItems = [];

        this.pendingRequestData = this.filterRequestorData(this.requestData, this.usersData, 'pending');
        this.incompleteRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'incomplete');
        this.completeRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'complete');
        this.declineRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'decline');
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  filterRequestorData(requestData: any[], usersData: any[], status: string) {
    const user_id = localStorage.getItem('user_id');

    const filteredData = requestData
      .filter((item: any) => item.from === user_id)
      .sort((a, b) => {
        const dateA = new Date(a.update_at);
        const dateB = new Date(b.update_at);
        return dateB.getTime() - dateA.getTime();
      })
      .map((item: any) => {
        const clonedItem = { ...item };

        const requestor = usersData.find((user: any) => user.id === item.from);
        if (requestor) {
          clonedItem.requestor_name = `${requestor.fname} ${requestor.lname}`;
          clonedItem.requestor_image = requestor.profile_pic;
        }

        clonedItem.request_list = item.request_list.filter((request: any) => request.status === status);
        clonedItem.item = clonedItem.request_list.length;

        return clonedItem;
      });

    const filteredDataWithItems = filteredData.filter((item: any) => item.request_list.length > 0);

    console.log(`Filtered Data for ${status}:`, filteredDataWithItems);

    return filteredDataWithItems;
  }

  performSearch() {
    this.pendingRequestData = this.pendingRequestData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.incompleteRequestorData = this.incompleteRequestorData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.completeRequestorData = this.completeRequestorData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.declineRequestorData = this.declineRequestorData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  resetFilteredRequestItems() {
    this.filteredRequestItems = [];
    this.index();
  }
  //shows the selected items of pending and approved complete
  filterRequestData(requestId: number) {
    // this.filteredRequestItems =
    const filteredRequest = this.pendingRequestData.find((item: any) => item.request_id === requestId);
    this.filteredRequestItems = filteredRequest ? filteredRequest.request_list : [];

    this.filteredRequestItems = this.filteredRequestItems.map((requestItem) => {
      const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

      const quantityApproved = requestItem.request_approved;
      const requestItemQuantity = requestItem.request_quantity;

      return {
        ...requestItem,
        item_name: item ? item.item_name : '',
        item_image_url: item ? item.item_image_url : '',
        request_approved: quantityApproved === null ? requestItemQuantity : quantityApproved,
        item_quantity: item ? item.item_quantity : '',
        item_price: item ? item.item_price : ''
      };
    });
    const newArrayOfItems = JSON.parse(JSON.stringify(this.filteredRequestItems));
    this.displayedColumns = ['Image', 'Name', 'Request Quantity'];
    this.dataSource = new MatTableDataSource(newArrayOfItems);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //shows the selected items of approved incomplete
  incompleteFilterRequestData(requestId: number) {
    const filteredRequest = this.incompleteRequestorData.find((item: any) => item.request_id === requestId);
    this.filteredRequestItems = filteredRequest ? filteredRequest.request_list : [];

    this.filteredRequestItems = this.filteredRequestItems
      .filter((requestItem) => requestItem.request_disapproved !== 0)
      .map((requestItem) => {
        const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

        return {
          ...requestItem,
          item_name: item ? item.item_name : '',
          item_image_url: item ? item.item_image_url : '',
          request_approved: requestItem.request_disapproved,
          item_quantity: item ? item.item_quantity : '',
          item_price: item ? item.item_price : ''
        };
      });
      
    const newArrayOfItems = JSON.parse(JSON.stringify(this.filteredRequestItems));
    this.displayedColumns = ['Image', 'Name', 'Request Quantity', 'Approved Items', 'Remaining Request'];
    this.dataSource = new MatTableDataSource(newArrayOfItems);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  completeFilterRequestData(requestId: number) {
    const filteredRequest = this.completeRequestorData.find((item: any) => item.request_id === requestId);
    this.filteredRequestItems = filteredRequest ? filteredRequest.request_list : [];

    this.filteredRequestItems = this.filteredRequestItems
      .filter((requestItem) => requestItem.request_disapproved === 0)
      .map((requestItem) => {
        const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

        return {
          ...requestItem,
          item_name: item ? item.item_name : '',
          item_image_url: item ? item.item_image_url : '',
          request_approved: requestItem.request_approved,
          item_quantity: item ? item.item_quantity : '',
          item_price: item ? item.item_price : ''
        };
      });
  }

  declineFilterRequestData(requestId: number) {
    const filteredRequest = this.declineRequestorData.find((item: any) => item.request_id === requestId);

    this.filteredRequestItems = filteredRequest ? filteredRequest.request_list : [];

    this.filteredRequestItems = this.filteredRequestItems
      // .filter((requestItem) => requestItem.request_disapproved === 0)
      .map((requestItem) => {
        const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);
        const quantityApproved = requestItem.request_approved;
        const requestItemQuantity = requestItem.request_quantity;

        return {
          ...requestItem,
          item_name: item ? item.item_name : '',
          item_image_url: item ? item.item_image_url : '',
          request_approved: quantityApproved === null ? requestItemQuantity : quantityApproved,
          item_quantity: item ? item.item_quantity : '',
          item_price: item ? item.item_price : ''
        };
      });
  }
}
