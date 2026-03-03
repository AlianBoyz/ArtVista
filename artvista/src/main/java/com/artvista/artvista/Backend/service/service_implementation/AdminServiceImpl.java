package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.dto.AuthResponse;
import com.artvista.artvista.Backend.dto.LoginRequest;
import com.artvista.artvista.Backend.service.AdminService;
import com.artvista.artvista.Backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class AdminServiceImpl implements AdminService {
    private final JwtUtil jwtUtil;

    @Value("${admin.emails}")
    private String adminEmails;

    @Value("${admin.password}")
    private String adminPassword;

    public AdminServiceImpl(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        List<String> adminEmailList = Arrays.stream(adminEmails.split(","))
                .map(String::trim)
                .toList();

        boolean isAdmin = adminEmailList.contains(email) && adminPassword.equals(password);
        if (!isAdmin) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        String token = jwtUtil.generateToken(email, Map.of("role", "ADMIN"));
        return new AuthResponse(token, null, "Admin", email);
    }

    @Override
    public AuthResponse isAdmin(LoginRequest request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isAdmin'");
    }
}
