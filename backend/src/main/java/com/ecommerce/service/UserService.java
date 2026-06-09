package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Transactional
    public User updateProfile(Long userId, String name, String phone) {
        User user = getUserById(userId);

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }

        if (phone != null && !phone.isBlank()) {
            // Check if phone is already used
            if (!phone.equals(user.getPhone()) && userRepository.existsByPhone(phone)) {
                throw new RuntimeException("Phone number already in use");
            }
            user.setPhone(phone);
        }

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid current password");
        }

        // Validate new password
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deactivateAccount(Long userId) {
        User user = getUserById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional
    public void activateAccount(Long userId) {
        User user = getUserById(userId);
        user.setActive(true);
        userRepository.save(user);
    }
}
