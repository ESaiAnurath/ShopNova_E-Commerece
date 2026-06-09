package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.model.Wishlist;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Wishlist getWishlist(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> createWishlist(user));
    }

    private Wishlist createWishlist(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public void addToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!wishlist.getProducts().contains(product)) {
            wishlist.getProducts().add(product);
            wishlistRepository.save(wishlist);
        }
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        wishlist.getProducts().remove(product);
        wishlistRepository.save(wishlist);
    }

    @Transactional(readOnly = true)
    public List<Product> getWishlistProducts(Long userId) {
        return getWishlist(userId).getProducts();
    }

    @Transactional(readOnly = true)
    public boolean isProductInWishlist(Long userId, Long productId) {
        Wishlist wishlist = getWishlist(userId);
        return wishlist.getProducts().stream()
                .anyMatch(p -> p.getId().equals(productId));
    }
}
