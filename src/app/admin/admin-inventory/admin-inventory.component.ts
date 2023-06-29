import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InventoryService } from 'src/app/service/inventory.service';
import { EditAddInventoryComponent } from '../modal/edit-add-inventory/edit-add-inventory.component';
import { WarningComponent } from 'src/app/modal/warning/warning.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-inventory',
  templateUrl: './admin-inventory.component.html',
  styleUrls: ['./admin-inventory.component.css']
})
export class AdminInventoryComponent implements OnInit, AfterViewInit {
  inventoryData!: any;
  loader = false;

  displayedColumns: string[] = ['item_name', 'item_description', 'item_price', 'item_quantity', 'item_image', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private inventoryService: InventoryService, private dialog: MatDialog, private toastr: ToastrService) {
    this.index();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  index(): void {
    this.inventoryService.index().subscribe(
      (response) => {
        this.inventoryData = response.data;

        // Add image property to each item

        this.dataSource = new MatTableDataSource(this.inventoryData);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  edit(id: string) {
    this.loader = true;
    this.inventoryService.show(id).subscribe(
      (response) => {
        this.loader = false;
        const dialogRef = this.dialog.open(EditAddInventoryComponent, {
          data: { inventory: response.data },
          width: '70%'
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.index();
          }
        });
      },
      (error) => {
        this.loader = false;
        console.log('There is something wrong');
      }
    );
  }

  add() {
    this.loader = false;
    const dialogRef = this.dialog.open(EditAddInventoryComponent, {
      data: { inventory: '' },
      width: '600px'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.index();
      }
    });
  }

  deleteConfirm(id: string) {
    const message = `Are you sure you want to remove this item/s?`;
    const header = `Confirm Remove`;
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
        this.delete(id);
      }
    });
  }

  delete(id: string) {
    this.inventoryService.delete(id).subscribe(
      (response) => {
        this.loader = false;
        this.showSuccess();
      },
      (error) => {
        this.loader = false;
        this.showError();
        console.log('There is something wrong');
      }
    );
  }

  showSuccess() {
    this.toastr.success('Request Success', 'Success');
  }

  showError() {
    this.toastr.error('Request Failed', 'Error');
  }

  // add() {}
}
