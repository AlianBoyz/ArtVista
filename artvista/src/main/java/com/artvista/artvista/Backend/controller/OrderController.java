package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.CheckoutRequest;
import com.artvista.artvista.Backend.model.Order;
import com.artvista.artvista.Backend.service.OrderService;
import com.artvista.artvista.Backend.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> placeOrder(@RequestBody Order order) {
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", orderService.placeOrder(order)));
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Order>> checkout(@RequestBody CheckoutRequest request, HttpServletRequest httpRequest) {
        Long userId = getAuthenticatedUserId(httpRequest);
        Order.PaymentType paymentType = request.getPaymentType() == null || request.getPaymentType().isBlank()
                ? Order.PaymentType.COD :
                Order.PaymentType.valueOf(request.getPaymentType().toUpperCase());
        Order order = orderService.checkout(userId, paymentType, request.getPaymentId(), request.getPaintingId());
        return ResponseEntity.ok(ApiResponse.success("Checkout completed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", orderService.getAllOrders()));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        return ResponseEntity.ok(ApiResponse.success("User orders fetched successfully", orderService.getOrdersByUser(userId)));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long orderId, HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        Order order = orderService.getOrderById(orderId);
        // Only allow access if order belongs to the requesting user OR if admin (admin check can be added later)
        if (!order.getUser().getId().equals(userId)) {
            return ResponseEntity.status(403).body(ApiResponse.error("Access denied"));
        }
        return ResponseEntity.ok(ApiResponse.success("Order fetched successfully", order));
    }

    private Long getAuthenticatedUserId(HttpServletRequest request) {
        Object value = request.getAttribute("authenticatedUserId");
        if (value instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalArgumentException("Authenticated user id not found in token");
    }
}
