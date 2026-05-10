package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.dto.AuthResponse;
import com.artvista.artvista.Backend.dto.LoginRequest;
import com.artvista.artvista.Backend.model.Admin;
import com.artvista.artvista.Backend.repository.AdminRepository;
import com.artvista.artvista.Backend.service.AdminService;
import com.artvista.artvista.Backend.util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;

    public AdminServiceImpl(AdminRepository adminRepository, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
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

        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid admin credentials"));

        if (!BCrypt.checkpw(password, admin.getPassword())) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        String token = jwtUtil.generateToken(email, Map.of(
                "userId", admin.getId(),
                "role", "ADMIN"
        ));
        return new AuthResponse(token, admin.getId(), admin.getName(), email);
    }

    @Override
    public AuthResponse isAdmin(LoginRequest request) {
        // Optional implementation if needed for specific admin checks
        return null;
    }
}
