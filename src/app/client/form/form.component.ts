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

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: [''],
    });
  }

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');
    if (clientId) {
      this.isEditing = true;
      this.loadClient(clientId);
    }
  }

  loadClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe((client: Client) => {
      this.clientForm.patchValue(client);
    });
  }

  onSave(): void {
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
  }

  onCancel(): void {
    this.router.navigate(['/client']);
  }
}
