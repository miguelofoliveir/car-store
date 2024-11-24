import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  totalProducts = 100;
  totalOrders = 200;
  totalClients = 50;

  orderStatusData = [
    { name: 'Aprovados', value: 120 },
    { name: 'Pendentes', value: 60 },
    { name: 'Rejeitados', value: 20 },
  ];

  lowStockData = [
    { name: 'Produto A', value: 5 },
    { name: 'Produto B', value: 2 },
    { name: 'Produto C', value: 8 },
  ];

}
