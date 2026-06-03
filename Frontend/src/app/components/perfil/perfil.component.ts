import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-perfil.component',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  profileMessage = '';
  profileError = '';
  passwordMessage = '';
  passwordError = '';
  deleteError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    const user = this.authService.getUser();

    this.profileForm = this.fb.group({
      nombre: [user?.nombre ?? '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email ?? '', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  updateProfile(): void {
    this.profileMessage = '';
    this.profileError = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.profileMessage = 'Datos actualizados con éxito. Vuelve a iniciar sesión para reflejar el cambio en tu sesión actual.';
      },
      error: (error) => {
        this.profileError = error?.error?.mensaje || 'No se pudieron actualizar los datos';
      },
    });
  }

  changePassword(): void {
    this.passwordMessage = '';
    this.passwordError = '';

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden';
      return;
    }

    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.passwordMessage = 'Contraseña actualizada con éxito.';
        this.passwordForm.reset();
      },
      error: (error) => {
        this.passwordError = error?.error?.mensaje || 'No se pudo cambiar la contraseña';
      },
    });
  }

  deleteAccount(): void {
    this.deleteError = '';

    const confirmed = window.confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmed) {
      return;
    }

    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.deleteError = error?.error?.mensaje || 'No se pudo eliminar la cuenta';
      },
    });
  }
}