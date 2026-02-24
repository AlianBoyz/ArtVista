package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.dto.AuthResponse;
import com.artvista.artvista.Backend.dto.LoginRequest;
import com.artvista.artvista.Backend.dto.SignupRequest;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.AuthService;
import com.artvista.artvista.Backend.util.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
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

        userRepository.findByEmail(request.getEmail()).ifPresent(existingUser -> {
            throw new IllegalArgumentException("Email is already in use");
        });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(BCrypt.hashpw(request.getPassword(), BCrypt.gensalt()));

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getEmail());

        return new AuthResponse(token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }
}
