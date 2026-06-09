package com.ecommerce.controller;

import com.ecommerce.config.JwtUtil;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    // ─── SEND OTP ────────────────────────────────────────────
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        // Check if email already registered
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered. Please login."));
        }

        try {
            otpService.sendOtp(email);
            return ResponseEntity.ok(Map.of(
                    "message", "OTP sent successfully to " + email,
                    "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("message", "Failed to send OTP: " + e.getMessage()));
        }
    }

    // ─── VERIFY OTP ──────────────────────────────────────────
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        if (email == null || otp == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email and OTP are required"));
        }

        try {
            otpService.verifyOtp(email, otp);
            return ResponseEntity.ok(Map.of(
                    "message", "Email verified successfully",
                    "emailVerified", true,
                    "email", email
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ─── LOGIN ───────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid email or password"));
        }

        User user = userRepository.findByEmail(email).orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phone", user.getPhone(),
                        "role", user.getRole()
                )
        ));
    }

    // ─── REGISTER ────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String phone = body.get("phone");
        String name = body.get("name");
        String otp = body.get("otp");

        // Validate inputs
        if (email == null || password == null || name == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email, password, and name are required"));
        }
      
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        // Verify OTP before registration
        try {
            if (otp == null || otp.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "OTP verification required"));
            }
            // OTP should already be verified from frontend
            if (!otpService.isEmailVerified(email)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Please verify your email with OTP first"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email verification failed"));
        }

        // Create new user
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setName(name);
        user.setEmailVerified(true);

        // First user becomes ADMIN
        if (userRepository.count() == 0) {
            user.setRole(User.Role.ADMIN);
        } else {
            user.setRole(User.Role.USER);
        }

        userRepository.save(user);

        // Delete OTP after successful registration
        otpService.deleteOtp(email);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "phone", user.getPhone(),
                        "role", user.getRole()
                )
        ));
    }

    // ─── MAKE ADMIN ──────────────────────────────────────────
    @PostMapping("/make-admin")
    public ResponseEntity<?> makeAdmin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String secretCode = body.get("secretCode");

        if (!"SHOPNOVA_ADMIN_2024".equals(secretCode)) {
            return ResponseEntity.status(403)
                    .body(Map.of("message", "Invalid secret code"));
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User not found"));
        }

        user.setRole(User.Role.ADMIN);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "✅ " + user.getName() + " is now an ADMIN!",
                "email", user.getEmail(),
                "role", user.getRole()
        ));
    }

    // ─── LOGOUT ──────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
