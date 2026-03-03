package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.dto.AuthResponse;
import com.artvista.artvista.Backend.dto.LoginRequest;

public interface AdminService {
    AuthResponse isAdmin(LoginRequest request);

    Object login(LoginRequest request);
}
