import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-supplier-layout',
  templateUrl: './supplier-layout.component.html',
  styleUrls: ['./supplier-layout.component.css']
})
export class SupplierLayoutComponent implements OnInit {
  assetPath = environment.assetPath;
  name!: string;
  role!: string;

  constructor(private authService: AuthService, private dialog: MatDialog, private cookieService: CookieService) {}
  ngOnInit(): void {
    const name = localStorage.getItem('name');
    const role = this.cookieService.get('role');
    this.name = name ? name : '';
    this.role = role ? role : '';
  }

  logout() {
    const message = 'Are you sure you want to logout?';
    const header = 'Logout';
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        header: header,
        message: message
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
