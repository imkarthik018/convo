package com.examly.springapp.controller;

import com.examly.springapp.configuration.JWTUtil;
import com.examly.springapp.model.User;
import com.examly.springapp.payload.AuthRequest;
import com.examly.springapp.payload.AuthResponse;
import com.examly.springapp.payload.SignupRequest;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:8083" })
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;

    private static final List<String> VALID_ROLES = Arrays.asList(
            "ROLE_ADMIN", "ROLE_USER", "ROLE_RESEARCHER", "ROLE_ENGINEER", "ROLE_PREMIUM");

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            // Validate role
            if (!VALID_ROLES.contains(request.getRole())) {
                request.setRole("ROLE_USER"); // Default to USER role
            }

            // Check if username exists
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest()
                        .body("Username already exists");
            }

            // Check if email exists
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body("Email already exists");
            }

            // Create user
            User user = userService.createUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getEmail(),
                    request.getRole());

            // Generate token
            String token = jwtUtil.generateToken(user.getUsername(),
                    List.of(() -> user.getRole()));

            AuthResponse response = new AuthResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Signup failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            User user = userService.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                        .body("Invalid username or password");
            }

            // Check if user is enabled
            if (!user.isEnabled()) {
                return ResponseEntity.badRequest()
                        .body("Account is disabled");
            }

            // Generate token
            String token = jwtUtil.generateToken(user.getUsername(),
                    List.of(() -> user.getRole()));

            AuthResponse response = new AuthResponse(
                    token,
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Login failed: " + e.getMessage());
        }
    }
}
