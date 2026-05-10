package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.service.CashfreeService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cashfree")
public class CashfreeController {

    private final CashfreeService cashfreeService;

    public CashfreeController(CashfreeService cashfreeService) {
        this.cashfreeService = cashfreeService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            @RequestParam Long userId,
            @RequestParam double amount) {
        try {
            Map<String, Object> order = cashfreeService.createOrder(userId, amount);
            return ResponseEntity.ok(ApiResponse.success("Cashfree order created", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
