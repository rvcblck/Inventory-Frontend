import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { InventoryService } from 'src/app/service/inventory.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-edit-add-inventory',
  templateUrl: './edit-add-inventory.component.html',
  styleUrls: ['./edit-add-inventory.component.css']
})
export class EditAddInventoryComponent implements OnInit {
  inventoryForm: FormGroup = new FormGroup({});
  submitAttempted = false;
  categoryData!: any;
  selectedImage: any;
  fileToUpload!: File;
  loader = false;
  supplierData!: any;

  constructor(
    public dialogRef: MatDialogRef<EditAddInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inventory: any },
    private formBuilder: FormBuilder,
    private inventoryService: InventoryService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.getCategory();

    if (this.data.inventory) {
      this.inventoryForm = this.formBuilder.group({
        item_name: [this.data.inventory.item_name, [Validators.required]],
        item_description: [this.data.inventory.item_description, [Validators.required]],
        item_price: [this.data.inventory.item_price, [Validators.required]],
        item_quantity: [this.data.inventory.item_quantity, [Validators.required]],
        item_image: [this.data.inventory.item_image, [Validators.required]],
        category_id: [this.data.inventory.category_id, [Validators.required]],
        supplier_id: [this.data.inventory.supplier_id, [Validators.required]]
      });
    } else {
      this.inventoryForm = this.formBuilder.group({
        item_name: ['', [Validators.required]],
        item_description: ['', [Validators.required]],
        item_price: ['', [Validators.required]],
        item_quantity: ['', [Validators.required]],
        item_image: ['', [Validators.required]],
        category_id: ['', [Validators.required]],
        supplier_id: ['', [Validators.required]]
      });
    }
  }
  getCategory() {
    this.inventoryService.indexCategory().subscribe(
      (response) => {
        this.categoryData = response.data;
        console.log(this.categoryData);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getSupplier() {
    this.userService.index().subscribe(
      (response) => {
        const supplier = response.data;
        this.supplierData = supplier.filter((item: any) => item.role.role === 'Supplier');
        console.log(this.supplierData);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.getCategory();
    this.getSupplier();
    console.log(this.data.inventory);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    this.fileToUpload = file;

    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.selectedImage = reader.result;
        this.inventoryForm.patchValue({
          item_image: reader.result
        });
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmitConfirm() {
    if (!this.inventoryForm.valid) {
      return;
    }

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
        this.onSubmit();
      }
    });
  }
  onSubmit() {
    const formData = new FormData();
    const formControls = this.inventoryForm.controls;
    Object.keys(formControls).forEach((controlName) => {
      const control = formControls[controlName];
      formData.append(controlName, control.value);
    });
    formData.delete('item_image');

    if (this.fileToUpload) {
      formData.append('item_image', this.fileToUpload);
    }

    formData.forEach((value: FormDataEntryValue, key: string) => {
      console.log(key + ' - ' + value);
    });

    if (this.data.inventory) {
      const id = this.data.inventory.item_id;
      this.inventoryService.update(formData, id).subscribe(
        (response) => {
          this.loader = false;
          this.showSuccess();
          this.dialogRef.close(true);
        },
        (error) => {
          this.loader = false;
          this.showError();
          console.log('There is something wrong');
        }
      );
    } else {
      this.inventoryService.store(formData).subscribe(
        (response) => {
          this.loader = false;
          this.showSuccess();
          this.dialogRef.close(true);
        },
        (error) => {
          this.loader = false;
          this.showError();
          console.log('There is something wrong');
        }
      );
    }
  }

  showSuccess() {
    this.toastr.success('Request Success', 'Success');
  }

  showError() {
    this.toastr.error('Request Failed', 'Error');
  }
}
