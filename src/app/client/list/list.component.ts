import { Component, OnInit } from '@angular/core';
import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  filters = { name: '', email: '' };

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.clientService.getClients().subscribe((data: Client[]) => {
      this.clients = data;
      this.filteredClients = [...this.clients];
    });
  }

  applyFilters(): void {
    this.filteredClients = this.clients.filter((client) => {
      const matchesName = client.name
        .toLowerCase()
        .includes(this.filters.name.toLowerCase());
      const matchesEmail = client.email
        .toLowerCase()
        .includes(this.filters.email.toLowerCase());
      return matchesName && matchesEmail;
    });
  }

  editClient(clientId: string): void {
    this.router.navigate(['/client/edit', clientId]);
  }

  deleteClient(clientId: string): void {
    if (confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(clientId).subscribe(() => {
        this.clients = this.clients.filter((client) => client.id !== clientId);
        this.applyFilters();
      });
    }
  }
}
