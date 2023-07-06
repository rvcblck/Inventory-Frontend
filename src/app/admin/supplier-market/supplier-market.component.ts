import { environment } from 'src/environments/environment';
import { ProcessRequestComponent } from 'src/app/requestor/modal/process-request/process-request.component';
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
  selector: 'app-supplier-market',
  templateUrl: './supplier-market.component.html',
  styleUrls: ['./supplier-market.component.css']
})
export class SupplierMarketComponent {
  assetPath = environment.assetPath;
  inventoryData!: any;
  userData!: any;
  cartList: any[] = [];
  searchTerm: string = '';
  filteredInventoryData!: any[];
  categoryData!: any;
  selectedCategory: string | null = null;
  selectedSupplier: any;
  loader = true;
  supplierData: any;
  //
  //
  //  for variables for request supplies
  //
  //
  requestData!: any;
  requestorData!: any;
  inventoryData2!: any;
  usersData!: any;
  dateFilter = 'this_day';
  filteredDate!: string;
  customFromDate: Date | null = null;
  customToDate: Date | null = null;
  incompleteRequestorData!: any;
  completeRequestorData!: any;
  declineRequestorData!: any;
  selectedTabIndex: number = 0;

  filteredRequestItems: any[] = [];
  isError = false;
  searchTerm2: string = '';
  pendingRequestData!: any[];
  completeItems: any[] = [];

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private invetoryService: InventoryService,
    private dialog: MatDialog,
    private userService: UserService,
    private requestService: RequestService,
    private inventoryService: InventoryService,
    private toastr: ToastrService,
    private orderService: OrderService
  ) {
    this.index();
    this.indexRequest();
    this.performSearch();
  }

  ngOnInit(): void {
    this.performSearch();
  }

  index(): void {
    forkJoin([this.invetoryService.index(), this.invetoryService.indexCategory(), this.userService.index()]).subscribe(
      ([index, indexCategory, user]) => {
        this.inventoryData = index.data;
        this.userData = user.data;
        this.filteredInventoryData = this.inventoryData;
        this.inventoryData.forEach((item: { count: number }) => {
          item.count = 0;
        });

        this.inventoryData.map((item: any) => {
          const inventoryData = this.userData.find((user: any) => user.id === item.supplier_id);

          item.supplier_name = inventoryData.company_name;
          item.logo_url = inventoryData.logo_url;
          item.supplier_contact_no = inventoryData.company_contact_no;
        });

        this.supplierData = this.userData.filter((item: any) => item.role.role === 'Supplier');

        console.log(this.supplierData);

        this.categoryData = indexCategory.data;
        this.categoryData.sort((a: any, b: any) => {
          const nameA = a.category.toLowerCase();
          const nameB = b.category.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  increaseCount(item: any) {
    item.count += 1;
  }

  decreaseCount(item: any) {
    if (item.count > 0) {
      item.count -= 1;
    }
  }

  addToCart(item: any): void {
    if (item.count === 0 || item.count === '') {
      return;
    }

    const count = parseInt(item.count);

    // Check if item_id is already in cart
    const existingItem = this.cartList.find((cartItem) => cartItem.item_id === item.item_id);
    if (existingItem) {
      // If item_id exists, update the count and calculate the new price
      existingItem.count += count;
      existingItem.totalPrice = existingItem.count * existingItem.item_price;
    } else {
      // If item_id does not exist, add the item to the cart and calculate the price
      const itemCopy = { ...item };
      itemCopy.count = count;
      itemCopy.totalPrice = itemCopy.count * itemCopy.item_price;
      this.cartList.push(itemCopy);
    }

    item.count = 0;
  }

  calculateTotalAmount(): number {
    let totalAmount = 0;
    for (const item of this.cartList) {
      totalAmount += item.totalPrice;
    }
    return totalAmount;
  }

  calculateTotalItems(): number {
    let totalItems = 0;
    for (const item of this.cartList) {
      totalItems += item.count;
    }
    return totalItems;
  }

  removeItemFromCart(item: any): void {
    const index = this.cartList.indexOf(item);
    if (index !== -1) {
      this.cartList.splice(index, 1);
    }
  }

  filterInventoryData(): void {
    if (!this.selectedCategory && !this.selectedSupplier) {
      this.filteredInventoryData = this.inventoryData;
    } else {
      this.filteredInventoryData = this.inventoryData.filter((item: any) => {
        const isCategoryMatch = !this.selectedCategory || item.category_id === this.selectedCategory;
        const isSupplierMatch = !this.selectedSupplier || item.supplier_name === this.selectedSupplier;
        return isCategoryMatch && isSupplierMatch;
      });
    }
  }

  performSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filterInventoryData();
    } else if (this.selectedCategory || this.selectedSupplier) {
      this.filteredInventoryData = this.inventoryData
        .filter((item: any) => {
          const isCategoryMatch = !this.selectedCategory || item.category_id === this.selectedCategory;
          const isSupplierMatch = !this.selectedSupplier || item.supplier_name === this.selectedSupplier;
          return isCategoryMatch && isSupplierMatch;
        })
        .filter(
          (item: any) =>
            item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            item.item_description.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    } else {
      this.filteredInventoryData = this.inventoryData.filter(
        (item: any) =>
          item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.item_description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    const isNumericInput = /[0-9]/.test(event.key);
    const isAllowedKey = allowedKeys.includes(event.key);
    const isSpecialKeyCombination = event.ctrlKey || event.altKey || event.metaKey;

    if (!isNumericInput && !isAllowedKey && !isSpecialKeyCombination) {
      event.preventDefault();
    }
  }

  processRequest() {
    if (!this.cartList.length) {
      return;
    }

    this.loader = true;
    const user_id = localStorage.getItem('user_id');
    if (user_id) {
      this.userService.show(user_id).subscribe(
        (response) => {
          this.loader = false;
          console.log(response.data);
          const dialogRef = this.dialog.open(ProcessRequestComponent, {
            data: { cart: this.cartList, user: response.data },
            width: '70%'
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.cartList = [];
            }
          });
        },
        (error) => {
          this.loader = false;
          console.log('There is something wrong');
        }
      );
    }
  }
  //
  //
  //
  // Request Supplies
  //
  //
  //
  //

  indexRequest(): void {
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
        this.inventoryData2 = inventory.data;
        this.filteredRequestItems = [];

        this.pendingRequestData = this.filterRequestorData(this.requestData, this.usersData, 'pending');
        this.incompleteRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'incomplete');
        this.completeRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'complete');
        this.declineRequestorData = this.filterRequestorData(this.requestData, this.usersData, 'decline');

        console.log(this.requestData);
        console.log(this.completeRequestorData);
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  filterRequestorData(requestData: any[], usersData: any[], status: string) {
    const user_id = localStorage.getItem('user_id');
    console.log(user_id);

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

    // console.log(`Filtered Data for ${status}:`, filteredDataWithItems);

    return filteredDataWithItems;
  }

  performSearch2() {
    this.pendingRequestData = this.pendingRequestData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm2.toLowerCase())
    );

    this.incompleteRequestorData = this.incompleteRequestorData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm2.toLowerCase())
    );

    this.completeRequestorData = this.completeRequestorData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm2.toLowerCase())
    );

    this.declineRequestorData = this.declineRequestorData.filter((requestor: { requestor: string }) =>
      requestor.requestor.toLowerCase().includes(this.searchTerm2.toLowerCase())
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
      const item = this.inventoryData2.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

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
        const item = this.inventoryData2.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

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
        const item = this.inventoryData2.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

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
        const item = this.inventoryData2.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);
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
