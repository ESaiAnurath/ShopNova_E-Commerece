package com.ecommerce.service;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public Cart getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> createCart(user));
    }

    private Cart createCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    @Transactional
    public CartItem addToCart(Long userId, Long productId, Integer quantity) {
        Cart cart = getCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check stock
        if (product.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        // Check if product already in cart
        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        if (cartItem != null) {
            // Update quantity
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            if (cartItem.getQuantity() > product.getStock()) {
                throw new RuntimeException("Quantity exceeds available stock");
            }
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setPrice(product.getPrice());
            cart.getItems().add(cartItem);
        }

        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void removeFromCart(Long userId, Long cartItemId) {
        Cart cart = getCart(userId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        cart.getItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
    }

    @Transactional
    public CartItem updateQuantity(Long userId, Long cartItemId, Integer newQuantity) {
        Cart cart = getCart(userId);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to this cart");
        }

        if (newQuantity <= 0) {
            removeFromCart(userId, cartItemId);
            return null;
        }

        if (newQuantity > cartItem.getProduct().getStock()) {
            throw new RuntimeException("Quantity exceeds available stock");
        }

        cartItem.setQuantity(newQuantity);
        return cartItemRepository.save(cartItem);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public BigDecimal getCartTotal(Long userId) {
        return getCart(userId).getTotalPrice();
    }
}
