import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  form:FormGroup;
    errorMessage = '';

    constructor(private fb:FormBuilder, 
                 private authService: AuthService, 
                 private router: Router) {

        this.form = this.fb.group({
            email: ['',Validators.required],
            password: ['',Validators.required]
        });
    }

    login() {
        this.errorMessage = '';
        const val = this.form.value;

        if (val.email && val.password) {
            this.authService.login(val.email, val.password)
                .subscribe({
                    next: (e) => {
                        this.authService.saveToken(e);
                        this.router.navigate(['/']);
                    },
                    error: (error) => {
                        const backendMessage = error?.error?.mensaje;
                        this.errorMessage = backendMessage === 'Contraseña incorrecta'
                            ? 'La contraseña es incorrecta.'
                            : backendMessage || 'No se pudo iniciar sesión. Verifica tus credenciales.';
                    },
                });
        }
    }
}
