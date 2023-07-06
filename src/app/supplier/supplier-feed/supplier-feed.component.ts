import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, forkJoin, map, startWith } from 'rxjs';
import { InventoryService } from 'src/app/service/inventory.service';
import { OrderService } from 'src/app/service/order.service';
import { RequestService } from 'src/app/service/request.service';
import { UserService } from 'src/app/service/user.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Router, NavigationExtras } from '@angular/router';
import { ShareService } from 'src/app/service/share.service';
import { BiddingService } from 'src/app/service/bidding.service';

@Component({
  selector: 'app-supplier-feed',
  templateUrl: './supplier-feed.component.html',
  styleUrls: ['./supplier-feed.component.css'],
  animations: [
    trigger('routeTransition', [
      transition(':enter', [
        style({ opacity: 0 }), // Initial state of the entering route
        animate('300ms', style({ opacity: 1 })) // Final state of the entering route
      ]),
      transition(':leave', [
        style({ opacity: 1 }), // Initial state of the leaving route
        animate('300ms', style({ opacity: 0 })) // Final state of the leaving route
      ])
    ])
  ]
})
export class SupplierFeedComponent implements OnInit {
  loader = false;
  requestorCompanies: any;
  orderList: any;
  inventoryData: any;
  dateFilter = 'all';
  customFromDate: any;
  customToDate: any;
  filteredOptions: any[] = [];
  filteredItems: any[] = [];
  filterTerm: string = '';
  selectedCompanyId: any;
  orderListFiltered: any;

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private inventoryService: InventoryService,
    private router: Router,
    private sharedService: ShareService
  ) {
    this.index();
  }

  ngOnInit() {}

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
        data.date_from = '';
        data.date_to = '';
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

    console.log(data);

    this.loader = true;
    forkJoin([
      this.dateFilter != 'all' ? this.orderService.indexFiltered(data) : this.orderService.index(),
      this.userService.getRequestorCompanies(),
      this.inventoryService.index()
    ]).subscribe(
      ([request, users, inventory]) => {
        this.loader = false;
        this.orderList = request.data;

        this.requestorCompanies = users.data;
        this.inventoryData = inventory.data;

        this.orderListData();
      },
      (error) => {
        this.loader = false;
        console.log(error);
      }
    );
  }

  orderListData() {
    const filteredData = this.orderList
      .map((item: any) => {
        const clonedItem = { ...item };

        const company = this.requestorCompanies.find((user: any) => user.company_id === item.company_id);
        if (company) {
          clonedItem.company_name = `${company.company_name}`;
          clonedItem.logo_url = company.logo_url;
        }

        clonedItem.order_list = item.order_list.map((requestItem: any) => {
          const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

          return {
            ...requestItem,
            item_name: item ? item.item_name : '',
            item_image_url: item ? item.item_image_url : '',
            unit: item ? item.unit.unit : ''
          };
        });

        clonedItem.item = item.order_list.length;

        return clonedItem;
      })
      .filter((item: any) => item.is_bidding === 1)
      .sort((a: any, b: any) => {
        return a.order_number - b.order_number;
      });

    this.orderListFiltered = filteredData;
  }

  filterItems() {
    this.filteredOptions = this.inventoryData.filter(
      (item: any) =>
        item.item_name.toLowerCase().includes(this.filterTerm.toLowerCase()) &&
        !this.filteredItems.some((selectedItem) => selectedItem.item_name === item.item_name)
    );
  }

  addToFilteredItems(item: any) {
    this.filteredItems.push(item);
    this.filterTerm = ''; // Clear the filter term after selecting an item
    console.log(this.filteredItems);
    // console.log(this.orderListFiltered);
    this.filterOrderList();
  }

  filterOrderList() {
    console.log(this.filteredItems);
    if (this.filteredItems.length === 0) {
      this.orderListData();
    } else {
      this.orderListData();
      const filteredItemIds = this.filteredItems.map((item: any) => item.item_id);
      this.orderListFiltered = this.orderListFiltered.filter((order: any) => {
        const orderItemIds = order.order_list.map((item: any) => item.item_id);
        return filteredItemIds.every((itemId) => orderItemIds.includes(itemId));
      });
    }
  }

  removeFromFilteredItems(item: any) {
    const index = this.filteredItems.indexOf(item);
    console.log(this.filteredItems);
    if (index > -1) {
      this.filteredItems.splice(index, 1);
    }

    this.filterOrderList();
  }

  resetOption() {
    this.filteredOptions = this.inventoryData.filter(
      (item: any) =>
        item.item_name.toLowerCase().includes(this.filterTerm.toLowerCase()) &&
        !this.filteredItems.some((selectedItem) => selectedItem.item_name === item.item_name)
    );
  }

  orderShow(order: string) {
    // console.log(order);
    this.sharedService.sharedObject = order;
    this.sharedService.inventoryData = this.inventoryData;
    this.router.navigateByUrl('/supplier/bidding-page');

    // how to pass order to component??
  }

  companyFilter() {
    console.log(this.orderList, this.selectedCompanyId);
    if (!this.selectedCompanyId) {
      console.log('wala');
      this.orderListData();
    } else {
      this.orderListFiltered = this.orderListFiltered.filter((item: any) => item.company_id === this.selectedCompanyId);
    }
  }
}
