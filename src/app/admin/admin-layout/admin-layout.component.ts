import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmComponent } from 'src/app/modal/confirm/confirm.component';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  name!: string;
  role!: string;
  assetPath = environment.assetPath;

  constructor(private cookieService: CookieService, private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const name = localStorage.getItem('name');
    const role = this.cookieService.get('role');

    if (name && role) {
      this.name = name;
      this.role = role;
    }

    const sidebar = document.querySelector<HTMLElement>('.sidebar');
    const closeBtn = document.querySelector<HTMLElement>('#btn');
    const searchBtn = document.querySelector<HTMLElement>('.bx-search');
    const personalLabel = document.querySelector<HTMLElement>('.personal-label');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        menuBtnChange();
      });
    }
    if (personalLabel) {
      personalLabel.textContent = '';
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        menuBtnChange();
      });
    }

    function menuBtnChange() {
      if (sidebar?.classList.contains('open')) {
        closeBtn?.classList.replace('bx-menu', 'bx-menu-alt-right');
        if (personalLabel) {
          personalLabel.textContent = 'Personal Profile';
        }
      } else {
        closeBtn?.classList.replace('bx-menu-alt-right', 'bx-menu');
        if (personalLabel) {
          personalLabel.textContent = '';
        }
      }
    }
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
