import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from 'src/app/service/inventory.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  invetoryData: any;
  orderDataList: any;
  totalPrice: any;

  constructor(
    public dialogRef: MatDialogRef<ViewOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { viewOrder: any },
    private inventoryService: InventoryService
  ) {
    this.inventoryService.index().subscribe(
      (response) => {
        this.invetoryData = response.data;

        const viewOrder = this.data.viewOrder.order_list.map((data: any) => {
          const newArray = { ...data };
          // console.log(newArray);
          const itemName = this.invetoryData.find((item: any) => item.item_id === data.item_id);
          // console.log(itemName);
          newArray.item_name = itemName.item_name;

          return newArray;
        });

        this.orderDataList = viewOrder;
        console.log(this.orderDataList);

        this.totalPrice = this.orderDataList.reduce((sum: any, item: any) => sum + item.order_price, 0);
      },
      (err) => {
        console.log('There was an error');
      }
    );
  }
  ngOnInit(): void {
    console.log(this.data.viewOrder);
  }
}
