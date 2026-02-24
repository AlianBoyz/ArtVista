package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.dto.AuthResponse;
import com.artvista.artvista.Backend.dto.LoginRequest;
import com.artvista.artvista.Backend.dto.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest request);

    AuthResponse login(LoginRequest request);
}
