package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.UpdateEventRegistrationStatusRequest;
import com.artvista.artvista.Backend.dto.UpdateOrderStatusRequest;
import com.artvista.artvista.Backend.model.EventRegistration;
import com.artvista.artvista.Backend.model.Order;
import com.artvista.artvista.Backend.service.AdminService;
import com.artvista.artvista.Backend.service.EventRegistrationService;
import com.artvista.artvista.Backend.service.OrderService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final OrderService orderService;
    private final EventRegistrationService eventRegistrationService;

    public AdminController(AdminService adminService, OrderService orderService,
            EventRegistrationService eventRegistrationService) {
        this.adminService = adminService;
        this.orderService = orderService;
        this.eventRegistrationService = eventRegistrationService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Boolean>> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        boolean isAdmin = adminService.isAdmin(email, password);

        if (!isAdmin) {
            throw new IllegalArgumentException("Invalid admin credentials");
        }

        return ResponseEntity.ok(ApiResponse.success("Admin login successful", true));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("Orders fetched successfully", orderService.getAllOrders()));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success("Order fetched successfully", orderService.getOrderById(orderId)));
    }

    @GetMapping("/orders/painting/{paintingId}")
    public ResponseEntity<ApiResponse<List<Order>>> getOrdersByPainting(@PathVariable Long paintingId) {
        return ResponseEntity.ok(ApiResponse.success("Painting orders fetched successfully", orderService.getOrdersByPaintingId(paintingId)));
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody UpdateOrderStatusRequest request) {
        Order.OrderStatus status = Order.OrderStatus.valueOf(request.getStatus().toUpperCase());
        Order updated = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @GetMapping("/event-registrations")
    public ResponseEntity<ApiResponse<List<EventRegistration>>> getAllEventRegistrations() {
        return ResponseEntity.ok(ApiResponse.success("Event registrations fetched successfully", eventRegistrationService.getAllRegistrations()));
    }

    @GetMapping("/event-registrations/{registrationId}")
    public ResponseEntity<ApiResponse<EventRegistration>> getEventRegistrationById(@PathVariable Long registrationId) {
        return ResponseEntity.ok(ApiResponse.success("Event registration fetched successfully", eventRegistrationService.getRegistrationById(registrationId)));
    }

    @GetMapping("/event-registrations/event/{eventId}")
    public ResponseEntity<ApiResponse<List<EventRegistration>>> getEventRegistrationsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success("Event registrations fetched successfully", eventRegistrationService.getRegistrationsByEvent(eventId)));
    }

    @PutMapping("/event-registrations/{registrationId}/status")
    public ResponseEntity<ApiResponse<EventRegistration>> updateEventRegistrationStatus(
            @PathVariable Long registrationId,
            @RequestBody UpdateEventRegistrationStatusRequest request) {
        EventRegistration.RegistrationStatus status = EventRegistration.RegistrationStatus.valueOf(request.getStatus().toUpperCase());
        EventRegistration updated = eventRegistrationService.updateRegistrationStatus(registrationId, status);
        return ResponseEntity.ok(ApiResponse.success("Event registration status updated successfully", updated));
    }
}
