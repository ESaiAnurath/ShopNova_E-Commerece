package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Review createReview(Long userId, Long productId, Integer rating, String comment) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // Check if user already reviewed this product
        if (reviewRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            throw new RuntimeException("You have already reviewed this product");
        }

        Review review = new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(rating);
        review.setComment(comment);

        Review savedReview = reviewRepository.save(review);

        // Update product rating
        updateProductRating(productId);

        return savedReview;
    }

    @Transactional
    public Review updateReview(Long reviewId, Integer rating, String comment) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (rating != null && (rating < 1 || rating > 5)) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        if (rating != null) review.setRating(rating);
        if (comment != null) review.setComment(comment);

        Review updatedReview = reviewRepository.save(review);

        // Update product rating
        updateProductRating(review.getProduct().getId());

        return updatedReview;
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        Long productId = review.getProduct().getId();
        reviewRepository.delete(review);

        // Update product rating
        updateProductRating(productId);
    }

    @Transactional(readOnly = true)
    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Transactional(readOnly = true)
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Double getAverageRating(Long productId) {
        Double avgRating = reviewRepository.getAverageRatingForProduct(productId);
        return avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0;
    }

    @Transactional(readOnly = true)
    public Integer getReviewCount(Long productId) {
        Integer count = reviewRepository.getReviewCountForProduct(productId);
        return count != null ? count : 0;
    }

    private void updateProductRating(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Double avgRating = getAverageRating(productId);
        Integer reviewCount = getReviewCount(productId);

        product.setRating(avgRating);
        product.setReviews(reviewCount);

        productRepository.save(product);
    }
}
