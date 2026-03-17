package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT SUM(o.amount) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal getTotalRevenue();
}
