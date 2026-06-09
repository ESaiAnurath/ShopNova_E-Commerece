package com.ecommerce.service;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.model.OtpToken;
import com.ecommerce.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;

    /**
     * Generate and send OTP to email
     
     */
public void sendOtp(String email) {

    String otp = RandomStringUtils.randomNumeric(6);

    OtpToken otpToken = otpTokenRepository.findByEmail(email)
            .orElse(new OtpToken());

    otpToken.setEmail(email);
    otpToken.setOtp(otp);
    otpToken.setVerified(false);
    otpToken.setVerifiedAt(null);

    otpTokenRepository.save(otpToken);

    emailService.sendOtpEmail(email, otp);
}
   public boolean verifyOtp(String email, String otp) {

    OtpToken otpToken = otpTokenRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("OTP not found for email: " + email));

    // Check expiry
    if (otpToken.isExpired()) {
        otpTokenRepository.delete(otpToken);
        throw new RuntimeException("OTP has expired. Please request a new OTP.");
    }

    // Check OTP match
    if (!otpToken.getOtp().equals(otp)) {
        throw new RuntimeException("Invalid OTP");
    }

    // Mark verified
    otpToken.setVerified(true);
    otpToken.setVerifiedAt(LocalDateTime.now());

    otpTokenRepository.save(otpToken);

    return true;
}
    /**
     * Check if email is OTP verified
     */
    public boolean isEmailVerified(String email) {
        return otpTokenRepository.findByEmail(email)
                .map(OtpToken::isVerified)
                .orElse(false);
    }

    /**
     * Delete OTP after registration
     */
    public void deleteOtp(String email) {
        otpTokenRepository.deleteByEmail(email);
    }
}
