import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from '../client.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  clientForm: FormGroup;
  isEditing = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.isEditing = true;
      this.loadClient(clientId);
    }
    this.isLoading = false;
  }

  loadClient(clientId: string): void {
    this.isLoading = true;
    this.clientService.getClientById(clientId).subscribe((client: Client) => {
      this.clientForm.patchValue(client);
      this.isLoading = false;
    });
  }

  onSave(): void {
    this.isLoading = true;
    if (this.clientForm.valid) {
      const client = this.clientForm.value;
      if (this.isEditing) {
        this.clientService
          .updateClient(this.route.snapshot.paramMap.get('id')!, client)
          .subscribe(() => this.router.navigate(['/client']));
      } else {
        this.clientService
          .createClient(client)
          .subscribe(() => this.router.navigate(['/client']));
      }
    }
    this.isLoading = false;
  }

  onCancel(): void {
    this.isLoading = true;
    this.router.navigate(['/client']);
    this.isLoading = false;
  }
}
