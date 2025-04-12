import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://webapid.onrender.com/api/product';
  private http = inject(HttpClient);

  private mapFromApi(apiProduct: any): Product {
    return {
      id: apiProduct.productID,
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.price,
      stock: apiProduct.unitsInStock,
      imageUrl: apiProduct.imageUrl
    };
  }

  private mapToApi(product: Product): any {
    return {
      productID: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      unitsInStock: product.stock,
      imageUrl: product.imageUrl
    };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(apiProducts => apiProducts.map(p => this.mapFromApi(p)))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(apiProduct => this.mapFromApi(apiProduct))
    );
  }

  searchProducts(term: string): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?term=${term}`).pipe(
      map(apiProducts => apiProducts.map(p => this.mapFromApi(p)))
    );
  }

  addProduct(product: Product): Observable<Product> {
    const payload = this.mapToApi(product);
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(apiProduct => this.mapFromApi(apiProduct))
    );
  }

  updateProduct(product: Product): Observable<Product> {
    const payload = this.mapToApi(product);
    return this.http.put<any>(`${this.apiUrl}/${product.id}`, payload).pipe(
      map(apiProduct => this.mapFromApi(apiProduct))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
