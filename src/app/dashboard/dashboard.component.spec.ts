import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { By } from '@angular/platform-browser';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [MatCardModule, MatButtonModule, NgxChartsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display total statistics correctly', () => {
    component.totalProducts = 100;
    component.totalOrders = 200;
    component.totalClients = 50;
    fixture.detectChanges();

    const statCards = fixture.debugElement.queryAll(By.css('.stat-card'));
    expect(statCards.length).toBe(3);
    expect(statCards[0].nativeElement.textContent).toContain('Produtos: 100');
    expect(statCards[1].nativeElement.textContent).toContain('Pedidos: 200');
    expect(statCards[2].nativeElement.textContent).toContain('Clientes: 50');
  });

  it('should display correct chart titles', () => {
    const chartTitles = fixture.debugElement.queryAll(By.css('.chart-card h3'));
    expect(chartTitles.length).toBe(2);
    expect(chartTitles[0].nativeElement.textContent).toContain(
      'Status de Pedidos'
    );
    expect(chartTitles[1].nativeElement.textContent).toContain('Estoque Baixo');
  });

  it('should have quick links with correct router links', () => {
    const buttons = fixture.debugElement.queryAll(
      By.css('.quick-links button')
    );
    expect(buttons.length).toBe(3);

    const [productsBtn, ordersBtn, clientsBtn] = buttons;
    expect(productsBtn.nativeElement.textContent).toContain('Produtos');
    expect(productsBtn.attributes['ng-reflect-router-link']).toBe('/products');

    expect(ordersBtn.nativeElement.textContent).toContain('Pedidos');
    expect(ordersBtn.attributes['ng-reflect-router-link']).toBe('/orders');

    expect(clientsBtn.nativeElement.textContent).toContain('Clientes');
    expect(clientsBtn.attributes['ng-reflect-router-link']).toBe('/clients');
  });
});
