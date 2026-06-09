package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Product> getAllProducts(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size));
    }

    @Transactional(readOnly = true)
    public List<Product> searchByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    public List<Product> getByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Transactional(readOnly = true)
    public List<Product> filterByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Transactional(readOnly = true)
    public List<Product> filterByRating(Double minRating) {
        return productRepository.findByRatingGreaterThanEqual(minRating);
    }

    @Transactional(readOnly = true)
    public Page<Product> getSortedProducts(String sortBy, int page, int size) {
        Pageable pageable;
        
        switch (sortBy.toLowerCase()) {
            case "price_asc":
                pageable = PageRequest.of(page, size, Sort.by("price").ascending());
                break;
            case "price_desc":
                pageable = PageRequest.of(page, size, Sort.by("price").descending());
                break;
            case "rating":
                pageable = PageRequest.of(page, size, Sort.by("rating").descending());
                break;
            case "newest":
                pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
                break;
            default:
                pageable = PageRequest.of(page, size);
        }
        
        return productRepository.findAll(pageable);
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        if (productDetails.getName() != null) product.setName(productDetails.getName());
        if (productDetails.getDescription() != null) product.setDescription(productDetails.getDescription());
        if (productDetails.getPrice() != null) product.setPrice(productDetails.getPrice());
        if (productDetails.getCategory() != null) product.setCategory(productDetails.getCategory());
        if (productDetails.getStock() != null) product.setStock(productDetails.getStock());
        if (productDetails.getImage() != null) product.setImage(productDetails.getImage());
        
        // Update stock status
        updateStockStatus(product);
        
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void reduceStock(Long productId, int quantity) {
        Product product = getProductById(productId);
        
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock for product: " + product.getName());
        }
        
        product.setStock(product.getStock() - quantity);
        updateStockStatus(product);
        productRepository.save(product);
    }

    @Transactional
    public void updateStockStatus(Product product) {
        if (product.getStock() <= 0) {
            product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
        } else if (product.getStock() <= 10) {
            product.setStatus(Product.ProductStatus.LOW_STOCK);
        } else {
            product.setStatus(Product.ProductStatus.ACTIVE);
        }
    }
}
