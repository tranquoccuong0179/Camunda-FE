import { CommonModule } from "@angular/common";
import { OrderService } from "./../../services/order.service";
import { Component, OnInit } from "@angular/core";
import { CurrencyPipe } from "../../pipe/currency.pipe";
import { Router } from "@angular/router";

@Component({
  selector: "app-order",
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="container">
      <header class="header">
        <div class="left-buttons">
          <button class="home-btn" (click)="navigateTo('user')">Users</button>
          <button class="home-btn" (click)="navigateTo('product')">
            Products
          </button>
        </div>
        <div class="title-wrapper">
          <h1 class="title">Danh sách đơn hàng</h1>
        </div>
      </header>

      <main class="content">
        <div
          *ngIf="orders.length > 0; else noOrders"
          class="order-table-wrapper"
        >
          <table class="order-table">
            <thead>
              <tr>
                <th>Tổng giá</th>
                <th>Số lượng sản phẩm</th>
                <th>Trạng thái</th>
                <th *ngIf="isAdmin">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td>{{ order.totalPrice | currency : "VND" }}</td>
                <td>{{ order.totalProduct }}</td>
                <td class="status" [ngClass]="getStatusClass(order.status)">
                  {{ order.status }}
                </td>
                <td *ngIf="isAdmin">
                  <button
                    *ngIf="order.status === 'PENDING'"
                    (click)="receiveOrder(order)"
                  >
                    Chấp nhận
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noOrders>
          <p class="no-orders">Không có đơn hàng nào.</p>
        </ng-template>
      </main>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f3f4f6;
        font-family: "Arial", sans-serif;
      }

      .header {
        background-color: #4f46e5;
        color: #fff;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .home-btn {
        background-color: #10b981;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .home-btn:hover {
        background-color: #059669;
      }

      .left-buttons {
        display: flex;
        gap: 10px;
      }

      .title {
        margin: 0;
        font-size: 24px;
        text-align: center;
      }
      .title-wrapper {
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .order-table-wrapper {
        width: 100%;
        max-width: 800px;
      }

      .order-table {
        width: 100%;
        border-collapse: collapse;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .order-table th,
      .order-table td {
        padding: 12px;
        text-align: center;
        border-bottom: 1px solid #ddd;
      }

      .order-table th {
        background: #4caf50;
        color: white;
        font-weight: bold;
      }

      .status {
        font-weight: bold;
        padding: 8px;
        border-radius: 4px;
      }

      .status.PENDING {
        background: #ffeb3b;
        color: #856404;
      }

      .status.COMPLETED {
        background: #4caf50;
        color: white;
      }

      .status.CANCELLED {
        background: #f44336;
        color: white;
      }
    `,
  ],
})
export class OrderAdminComponent implements OnInit {
  orders: any[] = [];
  isAdmin: boolean = false;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.checkIfAdmin();
    if (this.isAdmin) {
      this.orderService.getOrdersForAdmin().subscribe({
        next: (data) => (this.orders = data),
        error: (err) => console.error("Lỗi khi lấy danh sách đơn hàng:", err),
      });
    } else {
      this.orderService.getOrders().subscribe({
        next: (data) => (this.orders = data),
        error: (err) => console.error("Lỗi khi lấy danh sách đơn hàng:", err),
      });
    }
  }

  getStatusClass(status: string): string {
    return status.toUpperCase();
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  receiveOrder(order: any): void {
    this.orderService.receiveOrder(order.id).subscribe({
      next: () => {
        console.log("Nhận đơn hàng thành công!");
        this.reloadOrders();
      },
      error: (err) => console.error("Lỗi khi nhận đơn hàng:", err),
    });
  }

  reloadOrders(): void {
    if (this.isAdmin) {
      this.orderService.getOrdersForAdmin().subscribe({
        next: (data) => (this.orders = data),
        error: (err) => console.error("Lỗi khi tải lại đơn hàng:", err),
      });
    } else {
      this.orderService.getOrders().subscribe({
        next: (data) => (this.orders = data),
        error: (err) => console.error("Lỗi khi tải lại đơn hàng:", err),
      });
    }
  }

  checkIfAdmin(): boolean {
    return true;
  }
}
