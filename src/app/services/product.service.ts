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

  private mapProduct(apiProduct: any): Product {
    return {
      id: apiProduct.productID,
      name: apiProduct.name,
      description: apiProduct.description,
      price: apiProduct.price,
      stock: apiProduct.unitsInStock,
      imageUrl: apiProduct.imageUrl
    };
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(products => products.map(p => this.mapProduct(p)))
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => this.mapProduct(p))
    );
  }

  searchProducts(term: string): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?term=${term}`).pipe(
      map(products => products.map(p => this.mapProduct(p)))
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
