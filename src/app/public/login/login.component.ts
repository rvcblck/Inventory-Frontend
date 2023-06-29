import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm?.invalid) {
      return;
    }

    // Here you can implement your login logic
    const email = this.loginForm?.value.email;
    const password = this.loginForm?.value.password;
    this.loading = true;
    this.authService.login(email, password).subscribe(
      (response) => {
        this.loading = false;
        this.showSuccess;
      },
      (error) => {
        this.loading = false;
        // Handle login error
      }
    );
  }

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
