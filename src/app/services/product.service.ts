import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// Định nghĩa interface cho response từ API
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

// Định nghĩa interface cho phản hồi từ API
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private apiUrl = "http://localhost:8080/api/v1/product"; // Thay thế bằng URL API thực tế

  constructor(private http: HttpClient) {}

  // Lấy danh sách sản phẩm từ API, chỉ trích xuất phần `data`
  getProducts(): Observable<Product[]> {
    return this.http.get<ApiResponse<Product[]>>(this.apiUrl).pipe(
      map((response) => response.data) // Chỉ lấy phần `data`
    );
  }
}
