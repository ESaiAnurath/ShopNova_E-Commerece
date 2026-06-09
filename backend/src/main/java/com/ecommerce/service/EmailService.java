package com.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String email, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@shopnova.com");
            message.setTo(email);
            message.setSubject("ShopNova - Email Verification OTP");
            message.setText(buildOtpEmailBody(otp));
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());
        }
    }

    private String buildOtpEmailBody(String otp) {
        return "Dear User,\n\n" +
                "Your ShopNova account verification OTP is: " + otp + "\n\n" +
                "This OTP will expire in 10 minutes.\n\n" +
                "Please do not share this OTP with anyone.\n\n" +
                "If you did not request this OTP, please ignore this email.\n\n" +
                "Thank you,\n" +
                "ShopNova Team";
    }

    public void sendPasswordResetEmail(String email, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@shopnova.com");
            message.setTo(email);
            message.setSubject("ShopNova - Password Reset");
            message.setText("Click the link below to reset your password:\n" + resetLink +
                    "\n\nThis link will expire in 1 hour.");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send reset email: " + e.getMessage());
        }
    }

    public void sendOrderConfirmationEmail(String email, Long orderId, String totalAmount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@shopnova.com");
            message.setTo(email);
            message.setSubject("ShopNova - Order Confirmation #" + orderId);
            message.setText("Thank you for your order!\n\n" +
                    "Order ID: " + orderId + "\n" +
                    "Total Amount: ₹" + totalAmount + "\n\n" +
                    "You will receive a tracking number soon.\n\n" +
                    "Thank you,\n" +
                    "ShopNova Team");
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send order email: " + e.getMessage());
        }
    }
}
