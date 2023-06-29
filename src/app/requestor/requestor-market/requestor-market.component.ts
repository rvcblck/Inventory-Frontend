import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { InventoryService } from 'src/app/service/inventory.service';
import { environment } from 'src/environments/environment';
import { ProcessRequestComponent } from '../modal/process-request/process-request.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-requestor-market',
  templateUrl: './requestor-market.component.html',
  styleUrls: ['./requestor-market.component.css']
})
export class RequestorMarketComponent implements OnInit {
  assetPath = environment.assetPath;
  inventoryData!: any;
  cartList: any[] = [];
  searchTerm: string = '';
  filteredInventoryData!: any[];
  categoryData!: any;
  selectedCategory: string | null = null;
  loader = true;

  constructor(private invetoryService: InventoryService, private dialog: MatDialog, private userService: UserService) {
    this.index();
    this.performSearch();
  }

  ngOnInit(): void {
    this.performSearch();
  }

  index(): void {
    forkJoin([this.invetoryService.index(), this.invetoryService.indexCategory()]).subscribe(
      ([index, indexCategory]) => {
        this.inventoryData = index.data;
        this.filteredInventoryData = this.inventoryData;
        this.inventoryData.forEach((item: { count: number }) => {
          item.count = 0;
        });

        console.log(this.inventoryData);

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

  toggleCategory(categoryId: string): void {
    if (this.selectedCategory === categoryId) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = categoryId;
    }
    this.filterInventoryDataByCategory();
  }

  filterInventoryDataByCategory(): void {
    if (this.selectedCategory === null) {
      this.filteredInventoryData = this.inventoryData;
    } else {
      this.filteredInventoryData = this.inventoryData.filter((item: any) => item.category_id === this.selectedCategory);
    }
  }

  performSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filterInventoryDataByCategory();
    } else {
      this.filteredInventoryData = this.inventoryData.filter(
        (item: any) =>
          item.item_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.item_description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filterInventoryDataByCategory();
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
}
