import { CurrencyPipe } from "./../../pipe/currency.pipe";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductService } from "../../services/product.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-product",
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="container">
      <header class="header">
        <button class="home-btn" (click)="goToHome()">Home</button>
        <h1 class="title">Product List</h1>
        <button *ngIf="isAdmin" class="add-btn">Thêm sản phẩm</button>
      </header>

      <main class="content">
        <div *ngIf="products.length > 0; else noProducts" class="product-grid">
          <div *ngFor="let product of products" class="product-card">
            <img [src]="product.imageUrl" alt="{{ product.name }}" />
            <h2>{{ product.name }}</h2>
            <p class="price">{{ product.price | currency : "VND" }}</p>
          </div>
        </div>

        <ng-template #noProducts>
          <p class="no-products">Không có sản phẩm nào.</p>
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
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .home-btn {
        position: absolute;
        left: 20px;
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

      .title {
        margin: 0;
        font-size: 24px;
      }

      .content {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        width: 100%;
        max-width: 1000px;
      }

      .product-card {
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
        background: white;
        transition: transform 0.3s ease-in-out;
      }

      .product-card:hover {
        transform: scale(1.05);
      }

      .product-card img {
        width: 100%;
        height: auto;
        border-radius: 10px;
      }

      .price {
        font-weight: bold;
        color: #e44d26;
      }

      .no-products {
        font-size: 18px;
        color: gray;
        text-align: center;
        margin-top: 20px;
      }

      .add-btn {
        background-color: #ff9800;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 5px;
        cursor: pointer;
        position: absolute;
        right: 20px;
      }

      .add-btn:hover {
        background-color: #e68900;
      }
    `,
  ],
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  isAdmin = false;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.checkAdminRole();
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log("Products loaded:", this.products);
      },
      error: (error) => {
        console.error("Error loading products:", error);
      },
    });
  }
  goToHome() {
    this.router.navigate(["/home"]);
  }

  checkAdminRole(): void {
    this.isAdmin = localStorage.getItem("role") === "admin";
  }
}
