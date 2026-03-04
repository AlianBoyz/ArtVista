package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.UpdateAddressRequest;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.service.UserService;
import com.artvista.artvista.Backend.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", userService.getAllUsers()));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getMyProfile(HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        return ResponseEntity.ok(ApiResponse.success("User fetched successfully", userService.getUserById(userId)));
    }

    @PutMapping("/me/address")
    public ResponseEntity<ApiResponse<User>> updateMyAddress(
            @RequestBody UpdateAddressRequest requestBody,
            HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", userService.updateAddress(userId, requestBody)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    private Long getAuthenticatedUserId(HttpServletRequest request) {
        Object value = request.getAttribute("authenticatedUserId");
        if (value instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalArgumentException("Authenticated user id not found in token");
    }
}
