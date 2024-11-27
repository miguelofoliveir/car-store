import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserRoleService } from '../user-role.service';
import { UserRole } from '../user-role.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  userForm!: FormGroup;
  roles = ['admin', 'vendor', 'client'];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserRoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        role: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isEditMode = true;
      this.loadUser(userId);
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  loadUser(userId: string): void {
    this.userService.getUserById(userId).subscribe((user) => {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '', 
        confirmPassword: '', 
      });
    });
  }

  onSave(): void {
    if (this.userForm.valid) {
      const { name, email, role, password } = this.userForm.value;
      const user: UserRole = { name, email, role, password };

      if (this.isEditMode) {
        const userId = this.route.snapshot.paramMap.get('id')!;
        this.userService.updateUser(userId, user).subscribe(() => {
          this.router.navigate(['/user-role']);
        });
      } else {
        this.userService.createUser(user).subscribe(() => {
          this.router.navigate(['/user-role']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/user-role']);
  }
}
