import { ProductCategory } from './../common/product-category';
import { Product } from './../common/product';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private productUrl = 'http://192.168.1.101:8081/api/products';
  private categoryUrl = 'http://192.168.1.101:8081/api/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(page: number, pageSize: number, 
                         categoryId: number): Observable<GetResponseProduct> {
                           
    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}` +
                      `&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]>  {
    const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(page: number, pageSize: number, 
                         theKeyword: string): Observable<GetResponseProduct> {

    const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${theKeyword}` +
                      `&page=${page}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    const searchUrl = `${this.productUrl}/${theProductId}`;

    return this.httpClient.get<Product>(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    pageNumber: number;
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

