package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.dto.AuthResponse;
import com.artvista.artvista.Backend.dto.LoginRequest;
import com.artvista.artvista.Backend.dto.SignupRequest;
import com.artvista.artvista.Backend.model.Admin;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.AdminRepository;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.AuthService;
import com.artvista.artvista.Backend.util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final JwtUtil jwtUtil;

    @Value("${admin.passkey}")
    private String adminPasskey;

    public AuthServiceImpl(UserRepository userRepository, AdminRepository adminRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse signup(SignupRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("Phone is required");
        }

        // Check uniqueness in both tables
        if (userRepository.findByEmail(request.getEmail()).isPresent() || 
            adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            if (!adminPasskey.equals(request.getPasskey())) {
                throw new IllegalArgumentException("Invalid admin passkey");
            }
            
            Admin admin = new Admin();
            admin.setName(request.getName());
            admin.setEmail(request.getEmail());
            admin.setPhone(request.getPhone());
            admin.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));
            admin.setRole("ADMIN");
            
            Admin savedAdmin = adminRepository.save(admin);
            String token = jwtUtil.generateToken(savedAdmin.getEmail(), Map.of(
                    "userId", savedAdmin.getId(),
                    "email", savedAdmin.getEmail(),
                    "role", "ADMIN"
            ));
            return new AuthResponse(token, savedAdmin.getId(), savedAdmin.getName(), savedAdmin.getEmail());
            
        } else {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));

            User savedUser = userRepository.save(user);
            String token = jwtUtil.generateToken(savedUser.getEmail(), Map.of(
                    "userId", savedUser.getId(),
                    "email", savedUser.getEmail(),
                    "role", "USER"
            ));

            return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        // First check Admin table
        Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (BCrypt.checkpw(request.getPassword(), admin.getPassword())) {
                String token = jwtUtil.generateToken(admin.getEmail(), Map.of(
                        "userId", admin.getId(),
                        "email", admin.getEmail(),
                        "role", "ADMIN"
                ));
                return new AuthResponse(token, admin.getId(), admin.getName(), admin.getEmail());
            }
        }

        // Then check User table
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (BCrypt.checkpw(request.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getEmail(), Map.of(
                        "userId", user.getId(),
                        "email", user.getEmail(),
                        "role", "USER"
                ));
                return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
            }
        }

        throw new IllegalArgumentException("Invalid email or password");
    }
}
