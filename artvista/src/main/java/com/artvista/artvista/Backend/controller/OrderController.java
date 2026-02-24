package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.CheckoutRequest;
import com.artvista.artvista.Backend.model.Order;
import com.artvista.artvista.Backend.service.OrderService;
import com.artvista.artvista.Backend.util.ApiResponse;
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
    public ResponseEntity<ApiResponse<Order>> checkout(@RequestBody CheckoutRequest request) {
        Order.PaymentType paymentType = request.getPaymentType() == null || request.getPaymentType().isBlank()
                ? Order.PaymentType.COD
                : Order.PaymentType.valueOf(request.getPaymentType().toUpperCase());
        Order order = orderService.checkoutFromCart(request.getUserId(), paymentType, request.getPaymentId());
        return ResponseEntity.ok(ApiResponse.success("Checkout completed successfully", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", orderService.getAllOrders()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("User orders fetched successfully", orderService.getOrdersByUser(userId)));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success("Order fetched successfully", orderService.getOrderById(orderId)));
    }
}
