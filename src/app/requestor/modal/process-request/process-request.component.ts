import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { DatePipe } from '@angular/common';
import { RequestService } from 'src/app/service/request.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-process-request',
  templateUrl: './process-request.component.html',
  styleUrls: ['./process-request.component.css']
})
export class ProcessRequestComponent implements OnInit {
  requestForm: FormGroup = new FormGroup({});
  submitAttempted = false;
  currentDate!: string | null;
  message: string = '';

  constructor(
    public dialogRef: MatDialogRef<ProcessRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cart: any; user: any },
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private requestService: RequestService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    console.log(this.data.cart, this.data.user);
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  calculateTotalAmount(): number {
    let totalAmount = 0;
    for (const item of this.data.cart) {
      totalAmount += item.totalPrice;
    }
    return totalAmount;
  }

  onSubmitConfirm() {
    this.submitAttempted = true;
    if (this.requestForm.invalid) {
      console.log('Invalid');
      return;
    }
    const message = `Are you sure you want to submit the form?`;
    const header = `Please double check the item/s you're about to request.`;
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
    const admin_id = localStorage.getItem('admin_id');
    const requestData = {
      items: this.data.cart,
      from: this.data.user.id, // from requestor
      to: admin_id, // to admin
      from_message: this.message
    };

    console.log(requestData);

    this.requestService.store(requestData).subscribe(
      (response) => {
        this.showSuccess();
        this.dialogRef.close(true);
      },
      (err) => {
        console.log(err);
        this.dialogRef.close(true);
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
