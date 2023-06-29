import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { InventoryService } from 'src/app/service/inventory.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/service/order.service';
import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { WarningComponent } from 'src/app/modal/warning/warning.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'app-admin-request',
  templateUrl: './admin-request.component.html',
  styleUrls: ['./admin-request.component.css']
})
export class AdminRequestComponent implements OnInit, AfterViewInit {
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
    // private orderService: orderService,
    private userService: UserService,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private requestService: RequestService,
    private dialog: MatDialog
  ) {
    this.index();
  }

  displayedColumns: string[] = [];
  displayedColumns2: string[] = [];
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isAllSelected() {
    // console.log(this.dataSource.data.length);
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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
      this.dateFilter != 'all' ? this.requestService.indexFiltered(data) : this.orderService.index(),
      this.userService.index(),
      this.inventoryService.index()
    ]).subscribe(
      ([request, users, inventory]) => {
        this.loader = false;
        this.requestData = request.data;
        this.usersData = users.data;
        this.inventoryData = inventory.data;
        this.filteredRequestItems = [];
        this.selection.clear();

        this.pendingRequestData = this.filterRequestorData(this.requestData, this.usersData, 'pending');
        this.incompleteRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'incomplete');
        this.completeRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'complete');
        this.declineRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'decline');

        console.log(this.requestData);
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  filterRequestorData(requestData: any[], usersData: any[], status: string) {
    const admin_id = localStorage.getItem('admin_id');
    const filteredData = requestData
      .map((item: any) => {
        const clonedItem = { ...item }; // Create a copy of the original object

        const requestor = usersData.find((user: any) => user.id === item.from);
        if (requestor) {
          clonedItem.requestor_name = `${requestor.fname} ${requestor.lname}`;
          clonedItem.requestor_image = requestor.profile_pic;
        }

        clonedItem.request_list = item.request_list.filter((list: any) => list.status === status);
        clonedItem.item = item.request_list.length;

        return clonedItem;
      })
      .filter((user: any) => user.from !== admin_id);

    const filteredDataWithItems = filteredData.filter((item: any) => item.request_list.length > 0);

    // console.log(`Filtered Data for ${status}:`, filteredDataWithItems);

    return filteredDataWithItems;
  }

  //shows the selected items of pending and approved complete
  filterRequestData(request_id: number) {
    // this.filteredRequestItems =
    console.log(request_id, 'eto');
    const filteredRequest = this.pendingRequestData.find((item: any) => item.request_id === request_id);
    this.filteredRequestItems = filteredRequest ? filteredRequest.request_list : [];

    this.filteredRequestItems = this.filteredRequestItems.map((requestItem) => {
      const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

      const requestApproved = requestItem.request_quantity;

      return {
        ...requestItem,
        item_name: item ? item.item_name : '',
        item_image_url: item ? item.item_image_url : '',
        request_approved: requestApproved,
        item_quantity: item ? item.item_quantity : '',
        item_price: item ? item.item_price : ''
      };
    });

    this.filteredRequestItems.sort((a, b) => {
      const dateA = new Date(a.update_at);
      const dateB = new Date(b.update_at);
      return dateB.getTime() - dateA.getTime();
    });

    console.log(this.filteredRequestItems);
    this.selection.clear();
    const newArrayOfItems = JSON.parse(JSON.stringify(this.filteredRequestItems));
    this.displayedColumns = ['select', 'Image', 'Name', 'Stock Available', 'Request Quantity', 'Approve'];
    this.dataSource = new MatTableDataSource(newArrayOfItems);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  //shows the selected items of approved incomplete
  incompleteFilterRequestData(request_id: number) {
    const filteredRequest = this.incompleteRequestorData.find((item: any) => item.request_id === request_id);
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
    this.selection.clear();
    const newArrayOfItems = JSON.parse(JSON.stringify(this.filteredRequestItems));
    this.displayedColumns2 = ['select', 'Image', 'Name', 'Stock Available', 'Request Quantity', 'Approved Items', 'Remaining Request', 'Approve'];
    this.dataSource = new MatTableDataSource(newArrayOfItems);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.toggleAllRows();
  }

  completeFilterRequestData(requestId: number) {
    const filteredRequest = this.completeRequestorData.find((item: any) => item.request_id === requestId);
    this.filteredRequestItems = filteredRequest ? filteredRequest.request_list : [];

    this.filteredRequestItems = this.filteredRequestItems
      .filter((requestItem) => requestItem.request_disapproved === 0)
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
      })
      .sort((a, b) => {
        // Sort by the 'updated_at' property in descending order
        if (a.updated_at > b.updated_at) {
          return -1;
        } else if (a.updated_at < b.updated_at) {
          return 1;
        }
        return 0;
      });
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

  onQuantityChange(item: any, event: any) {
    const inputValue = parseInt(event.target.value);
    if (!isNaN(inputValue)) {
      item.request_approved = inputValue === item.request_quantity ? item.request_quantity : inputValue;
    } else {
      item.request_approved = null;
    }

    this.isError =
      inputValue > item.request_quantity || inputValue > item.item_quantity || inputValue === 0 || inputValue === null || Number.isNaN(inputValue);

    console.log(this.isError);
  }

  onCheckboxChange(item: any) {
    if (item.request_disapproved) {
      item.request_approved = item.request_disapproved;
    } else {
      if (item.request_approved !== item.request_quantity) {
        item.request_approved = item.request_quantity;
      } else {
        item.request_approved = null;
      }
    }
  }

  // isAnyInputGreaterThanQuantity(): boolean {
  //   return this.filteredRequestItems.some((item) => {
  //     const inputValue = parseInt(item.request_approved);
  //     return inputValue > item.request_quantity;
  //   });
  // }

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    const isNumericInput = /[0-9]/.test(event.key);
    const isAllowedKey = allowedKeys.includes(event.key);
    const isSpecialKeyCombination = event.ctrlKey || event.altKey || event.metaKey;

    if (!isNumericInput && !isAllowedKey && !isSpecialKeyCombination) {
      event.preventDefault();
    }
  }

  hasError(): boolean {
    if (!this.selection.selected.length) {
      return true;
    }

    if (this.isError) {
      return true;
    }

    // console.log(this.filteredRequestItems);
    return this.selection.selected.some((item) => item.request_approved > item.item_quantity || item.request_approved > item.request_quantity);
  }

  approveOrderConfirm() {
    const message = `Are you sure you want to aprrove this item/s?`;
    const header = `Confirm Approve`;
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
        this.approveOrder();
      }
    });
  }

  declineOrderConfirm() {
    const message = `Are you sure you want to decline this item/s?`;
    const header = `Confirm Decline`;
    const dialogRef = this.dialog.open(WarningComponent, {
      width: '400px',
      data: {
        header: header,
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // The user confirmed the action, submit the form
        this.declineOrder();
      }
    });
  }

  approveOrder() {
    if (!this.filteredRequestItems.length) {
      return;
    }
    const id = this.selection.selected[0].request_id;
    const foundItem = this.requestData.find((item: any) => item.request_id === id);

    const newArrayOfItems = JSON.parse(JSON.stringify(this.selection.selected));
    const orderItems = JSON.parse(JSON.stringify(this.selection.selected));
    const admin_id = localStorage.getItem('admin_id');
    const orderData = {
      data: orderItems,
      from: admin_id, // order sender
      to: foundItem.from, // order receiver
      qr_code: foundItem.qr_code
    };

    // computation

    for (const item of newArrayOfItems) {
      if (item.status === 'pending') {
        item.request_disapproved = item.request_quantity - item.request_approved;
        if (item.request_disapproved !== 0) {
          item.status = 'incomplete';
        } else {
          item.status = 'complete';
        }
      } else if (item.status === 'incomplete') {
        item.request_approved = item.request_quantity - (item.request_disapproved - item.request_approved);
        item.request_disapproved = item.request_quantity - item.request_approved;
        if (item.request_disapproved !== 0) {
          item.status = 'incomplete';
        } else {
          item.status = 'complete';
        }
      }
    }

    //for request udpate
    const data = {
      data: newArrayOfItems
    };

    console.log(data, orderData);

    this.loader = true;
    forkJoin([this.requestService.update(data, id), this.orderService.store(orderData)]).subscribe(
      ([request]) => {
        this.loader = false;
        this.index();
        this.showSuccess();
      },
      (err) => {
        this.loader = false;
        this.showError();
        console.log(err);
      }
    );

    this.filteredRequestItems = [];
    this.selection.clear();
  }

  declineOrder() {
    if (!this.selection.selected.length) {
      // console.log('here');
      return;
    }

    const id = this.selection.selected[0].request_id;

    const foundItem = this.requestData.find((item: any) => item.request_id === id);

    const newArrayOfItems = JSON.parse(JSON.stringify(this.selection.selected));
    const orderItems = JSON.parse(JSON.stringify(this.selection.selected));
    const orderData = {
      data: orderItems,
      requestor_id: foundItem.requestor_id
    };

    // computation

    console.log(newArrayOfItems);

    for (const item of newArrayOfItems) {
      if (item.status === 'pending') {
        item.request_disapproved = item.request_quantity - item.request_approved;
        item.request_approved = 0;
        item.status = 'decline';
      } else if (item.status === 'incomplete') {
        item.status = 'decline';
      }
    }

    const data = {
      data: newArrayOfItems
    };

    console.log(data);

    this.loader = true;
    this.requestService.update(data, id).subscribe(
      (response) => {
        this.loader = false;
        this.index();
        this.showSuccess();
      },
      (err) => {
        this.loader = false;
        this.showError();
        console.log(err);
      }
    );

    this.filteredRequestItems = [];
    this.selection.clear();
  }

  showSuccess() {
    this.toastr.success('Request Success', 'Success');
  }

  showError() {
    this.toastr.error('Request Failed', 'Error');
  }
}
