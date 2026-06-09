package com.ecommerce.repository;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findByEmail(String email);

    @Transactional
    void deleteByEmail(String email);
}
