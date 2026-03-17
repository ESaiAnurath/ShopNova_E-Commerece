package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository productRepository;

    // ── GET ALL ──────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        if (category != null && !category.isEmpty())
            return ResponseEntity.ok(productRepository.findByCategory(category));
        if (search != null && !search.isEmpty())
            return ResponseEntity.ok(productRepository.findByNameContainingIgnoreCase(search));
        return ResponseEntity.ok(productRepository.findAll());
    }

    // ── GET ONE ──────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // ── ADD PRODUCT ──────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> addProduct(@RequestBody Map<String, Object> body) {
        try {
            // Validate required fields
            if (!body.containsKey("name") || body.get("name").toString().isBlank())
                return ResponseEntity.badRequest().body(Map.of("message", "Product name is required"));
            if (!body.containsKey("price") || body.get("price") == null)
                return ResponseEntity.badRequest().body(Map.of("message", "Price is required"));

            Product product = new Product();
            product.setName(body.get("name").toString());

            if (body.get("description") != null)
                product.setDescription(body.get("description").toString());
            if (body.get("category") != null)
                product.setCategory(body.get("category").toString());
            if (body.get("image") != null)
                product.setImage(body.get("image").toString());
            if (body.get("badge") != null && !body.get("badge").toString().isEmpty())
                product.setBadge(body.get("badge").toString());

            // Parse numbers safely
            product.setPrice(new BigDecimal(body.get("price").toString()));

            if (body.get("originalPrice") != null && !body.get("originalPrice").toString().equals("null"))
                product.setOriginalPrice(new BigDecimal(body.get("originalPrice").toString()));

            int stock = 0;
            if (body.get("stock") != null)
                stock = Integer.parseInt(body.get("stock").toString());
            product.setStock(stock);

            if (body.get("rating") != null)
                product.setRating(Double.parseDouble(body.get("rating").toString()));

            // Auto-set status based on stock
            if (stock == 0)       product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
            else if (stock < 10)  product.setStatus(Product.ProductStatus.LOW_STOCK);
            else                  product.setStatus(Product.ProductStatus.ACTIVE);

            Product saved = productRepository.save(product);
            return ResponseEntity.ok(Map.of(
                "message", "Product added successfully!",
                "product", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    // ── UPDATE PRODUCT ───────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id,
                                           @RequestBody Map<String, Object> body) {
        return productRepository.findById(id).map(product -> {
            try {
                if (body.get("name")        != null) product.setName(body.get("name").toString());
                if (body.get("description") != null) product.setDescription(body.get("description").toString());
                if (body.get("category")    != null) product.setCategory(body.get("category").toString());
                if (body.get("image")       != null) product.setImage(body.get("image").toString());
                if (body.get("badge")       != null) product.setBadge(body.get("badge").toString().isEmpty() ? null : body.get("badge").toString());
                if (body.get("price")       != null) product.setPrice(new BigDecimal(body.get("price").toString()));
                if (body.get("originalPrice") != null && !body.get("originalPrice").toString().equals("null"))
                    product.setOriginalPrice(new BigDecimal(body.get("originalPrice").toString()));
                if (body.get("rating")      != null) product.setRating(Double.parseDouble(body.get("rating").toString()));

                if (body.get("stock") != null) {
                    int stock = Integer.parseInt(body.get("stock").toString());
                    product.setStock(stock);
                    if (stock == 0)       product.setStatus(Product.ProductStatus.OUT_OF_STOCK);
                    else if (stock < 10)  product.setStatus(Product.ProductStatus.LOW_STOCK);
                    else                  product.setStatus(Product.ProductStatus.ACTIVE);
                }

                Product saved = productRepository.save(product);
                return ResponseEntity.ok(Map.of("message", "Product updated!", "product", saved));
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE PRODUCT ───────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id))
            return ResponseEntity.notFound().build();
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted!"));
    }
}