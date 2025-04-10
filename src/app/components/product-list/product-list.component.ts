import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  searchTerm = signal<string>('');
  
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  updateSearchTerm(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  searchProducts(): void {
    if (this.searchTerm().trim()) {
      this.productService.searchProducts(this.searchTerm()).subscribe({
        next: (data) => {
          this.products.set(data);
        },
        error: (error) => {
          console.error('Error searching products:', error);
        }
      });
    } else {
      this.loadProducts();
    }
  }

  resetSearch(): void {
    this.searchTerm.set('');
    this.loadProducts();
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products.update(products => products.filter(product => product.id !== id));
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }
}