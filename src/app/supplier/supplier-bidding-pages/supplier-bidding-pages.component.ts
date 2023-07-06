import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { BiddingService } from 'src/app/service/bidding.service';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-supplier-bidding-pages',
  templateUrl: './supplier-bidding-pages.component.html',
  styleUrls: ['./supplier-bidding-pages.component.css']
})
export class SupplierBiddingPagesComponent implements OnInit {
  orderData: any;
  inventoryData: any;
  loader = false;
  constructor(
    private route: ActivatedRoute,
    private sharedService: ShareService,
    private router: Router,
    private dialog: MatDialog,
    private biddingService: BiddingService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.orderData = this.sharedService.sharedObject;
    this.inventoryData = this.sharedService.inventoryData;

    if (!this.orderData) {
      this.router.navigateByUrl('/supplier/feed');
    }

    this.orderData.order_total_price = 0;
    console.log(this.orderData);

    this.orderData.order_list = this.orderData.order_list.map((requestItem: any) => {
      const item = this.inventoryData.find((inventoryItem: any) => inventoryItem.item_id === requestItem.item_id);

      return {
        ...requestItem,
        item_name: item.item_name,
        item_image_url: item.item_image_url,
        unit: item.unit.unit,
        price_per_item: null,
        total_price: null
      };
    });
  }

  back() {
    this.router.navigateByUrl('/supplier/feed');
  }
  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Home', 'End'];
    const isNumericInput = /^\d*\.?\d*$/.test(event.key) || event.key === '.'; // Allow decimal input
    const isAllowedKey = allowedKeys.includes(event.key);
    const isSpecialKeyCombination = event.ctrlKey || event.altKey || event.metaKey;

    if (!isNumericInput && !isAllowedKey && !isSpecialKeyCombination) {
      event.preventDefault();
    }
  }

  onQuantityChange(item: any, event: any) {
    const inputValue = parseFloat(event.target.value);
    console.log(item.price_per_item, 'eto');

    item.price_per_item = inputValue;

    if (!isNaN(inputValue)) {
      item.total_price = inputValue * item.order_quantity;
    } else {
      item.total_price = null;
    }

    const prices: any[] = [];

    // Get all items prices
    this.orderData.order_list.map((price: any) => {
      prices.push(price.total_price);
    });

    // Calculate order total price
    const orderTotal = prices.reduce((accumulator, currentPrice) => accumulator + currentPrice, 0);

    console.log(orderTotal); // Display the order total price

    this.orderData.order_total_price = orderTotal;

    // if (!isNaN(inputValue)) {
    //   item.price_per_item = inputValue === item.request_quantity ? item.request_quantity : inputValue;
    // } else {
    //   item.request_approved = null;
    // }
  }

  hasErrors() {
    return this.orderData.order_list.some((item: any) => !item.total_price);
  }

  makeBidConfirm() {
    const message = `Are you sure you want to bid`;
    const header = `Bid Confirmation`;
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
        this.makeBid();
      }
    });
  }

  makeBid() {
    console.log(this.orderData);
    this.loader = true;
    this.biddingService.store(this.orderData).subscribe(
      (response) => {
        this.loader = false;
        this.showSuccess();
        this.router.navigateByUrl('/supplier/feed');
      },
      (err) => {
        this.loader = false;
        this.showError();
        console.log(err);
      }
    );
  }

  showSuccess() {
    this.toastr.success('Request Success', 'Success');
  }

  showError() {
    this.toastr.error('Request Failed', 'Error');
  }
}
