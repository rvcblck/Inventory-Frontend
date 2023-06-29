import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  constructor(private toastr: ToastrService) {}
  ngOnInit(): void {}

  // showSuccess() {
  //   this.toastr.success('Loggin Success', 'Success');
  // }
}
