package com.ecommerce.controller;

import com.ecommerce.config.JwtUtil;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
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

    // ─── LOGIN ───────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
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
                "id",    user.getId(),
                "name",  user.getName(),
                "email", user.getEmail(),
                "role",  user.getRole()   // ← sends role to frontend
            )
        ));
    }

    // ─── REGISTER ────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "Email already in use"));
        }

        User user = new User();
        user.setName(body.get("name"));
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(body.get("password")));

        // First ever user becomes ADMIN automatically!
        if (userRepository.count() == 0) {
            user.setRole(User.Role.ADMIN);
        } else {
            user.setRole(User.Role.USER);
        }

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "name",  user.getName(),
                "email", user.getEmail(),
                "role",  user.getRole()
            )
        ));
    }

    // ─── MAKE ADMIN (for you to promote yourself) ────────────
    @PostMapping("/make-admin")
    public ResponseEntity<?> makeAdmin(@RequestBody Map<String, String> body) {
        String email      = body.get("email");
        String secretCode = body.get("secretCode");

        // Secret code to prevent random people from making themselves admin
        if (!"SHOPNOVA_ADMIN_2024".equals(secretCode)) {
            return ResponseEntity.status(403)
                .body(Map.of("message", "Invalid secret code"));
        }

        User user = userRepository.findByEmail(email)
            .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("message", "User not found"));
        }

        user.setRole(User.Role.ADMIN);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "message", "✅ " + user.getName() + " is now an ADMIN!",
            "email",   user.getEmail(),
            "role",    user.getRole()
        ));
    }

    // ─── LOGOUT ──────────────────────────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
