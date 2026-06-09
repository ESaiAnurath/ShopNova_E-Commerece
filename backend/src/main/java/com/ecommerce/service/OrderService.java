package com.ecommerce.service;

import com.ecommerce.model.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final EmailService emailService;

    @Transactional
    public Order createOrder(Long userId, String deliveryAddress, String mobileNumber) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartService.getCart(userId);
        
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate total
        BigDecimal totalAmount = cart.getTotalPrice();
        BigDecimal shippingCharge = BigDecimal.valueOf(50);
        BigDecimal finalAmount = totalAmount.add(shippingCharge);

        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(finalAmount);
        order.setDeliveryAddress(deliveryAddress);
        order.setMobileNumber(mobileNumber);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setTrackingNumber(generateTrackingNumber());

        // Reduce stock for each product
        for (CartItem item : cart.getItems()) {
            productService.reduceStock(item.getProduct().getId(), item.getQuantity());
        }

        Order savedOrder = orderRepository.save(order);

        // Send order confirmation email
        try {
            emailService.sendOrderConfirmationEmail(
                    user.getEmail(),
                    savedOrder.getId(),
                    finalAmount.toString()
            );
        } catch (Exception e) {
            // Log error but don't fail the order
            System.err.println("Failed to send order email: " + e.getMessage());
        }

        // Clear cart
        cartService.clearCart(userId);

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Transactional(readOnly = true)
    public List<Order> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Order cancelOrder(Long orderId) {
        Order order = getOrderById(orderId);

        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }

        if (order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Order is already cancelled");
        }

        order.setStatus(Order.OrderStatus.CANCELLED);
        
        // Refund payment if completed
        if (order.getPaymentStatus() == Order.PaymentStatus.COMPLETED) {
            order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order markPaymentComplete(Long orderId, String paymentId) {
        Order order = getOrderById(orderId);
        order.setPaymentId(paymentId);
        order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
        order.setStatus(Order.OrderStatus.CONFIRMED);
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private String generateTrackingNumber() {
        return "TRACK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
