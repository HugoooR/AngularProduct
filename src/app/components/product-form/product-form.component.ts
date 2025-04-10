import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = signal<boolean>(false);
  productId = signal<number | null>(null);
  submitted = signal<boolean>(false);
  
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEditMode.set(true);
        this.productId.set(+params['id']);
        this.loadProduct(this.productId());
      }
    });
  }

  loadProduct(id: number | null): void {
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
        },
        error: (error) => {
          console.error('Error loading product:', error);
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.productForm.invalid) {
      return;
    }

    const product: Product = this.productForm.value;

    if (this.isEditMode() && this.productId()) {
      product.id = this.productId() ?? undefined;
      this.productService.updateProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
        }
      });
    } else {
      this.productService.addProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
        }
      });
    }
  }

  get f() { return this.productForm.controls; }
}