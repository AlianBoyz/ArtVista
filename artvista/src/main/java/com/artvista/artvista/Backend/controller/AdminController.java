package com.artvista.artvista.Backend.controller;
import com.artvista.artvista.Backend.dto.AuthResponse;
import com.artvista.artvista.Backend.dto.LoginRequest;
import com.artvista.artvista.Backend.dto.UpdateEventRegistrationStatusRequest;
import com.artvista.artvista.Backend.dto.UpdateOrderStatusRequest;
import com.artvista.artvista.Backend.model.EventRegistration;
import com.artvista.artvista.Backend.model.Order;
import com.artvista.artvista.Backend.model.Complaint;
import com.artvista.artvista.Backend.service.AdminService;
import com.artvista.artvista.Backend.service.ComplaintService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.repository.PaintingsRepository;
import com.artvista.artvista.Backend.repository.EventRepository;
import com.artvista.artvista.Backend.repository.OrderRepository;
import com.artvista.artvista.Backend.repository.EventRegistrationRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final OrderService orderService;
    private final EventRegistrationService eventRegistrationService;
    private final ComplaintService complaintService;
    private final UserRepository userRepository;
    private final PaintingsRepository paintingsRepository;
    private final EventRepository eventRepository;
    private final OrderRepository orderRepository;
    private final EventRegistrationRepository eventRegistrationRepository;

    public AdminController(AdminService adminService, OrderService orderService,
            EventRegistrationService eventRegistrationService, ComplaintService complaintService,
            UserRepository userRepository, PaintingsRepository paintingsRepository,
            EventRepository eventRepository, OrderRepository orderRepository,
            EventRegistrationRepository eventRegistrationRepository) {
        this.adminService = adminService;
        this.orderService = orderService;
        this.eventRegistrationService = eventRegistrationService;
        this.complaintService = complaintService;
        this.userRepository = userRepository;
        this.paintingsRepository = paintingsRepository;
        this.eventRepository = eventRepository;
        this.orderRepository = orderRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Object>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Admin login successful", adminService.login(request)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        long usersCount = userRepository.count();
        long paintingsCount = paintingsRepository.count();
        long eventsCount = eventRepository.count();

        BigDecimal paintingSales = orderRepository.findAll().stream()
                .filter(o -> o.getOrrderStatus() != Order.OrderStatus.REJECT)
                .map(o -> o.getTotalAmount() != null ? o.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal eventSales = eventRegistrationRepository.findAll().stream()
                .filter(r -> r.getStatus() != EventRegistration.RegistrationStatus.REJECT)
                .map(r -> r.getEvent() != null && r.getEvent().getPrice() != null ? r.getEvent().getPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalSales = paintingSales.add(eventSales);

        Map<String, Object> stats = Map.of(
                "users", usersCount,
                "paintings", paintingsCount,
                "events", eventsCount,
                "sales", totalSales
        );

        return ResponseEntity.ok(ApiResponse.success("Dashboard stats fetched successfully", stats));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<Object>> getAllOrders(
            @RequestParam(required = false) Integer page,
            @RequestParam(defaultValue = "10") int size) {
        if (page != null) {
            return ResponseEntity.ok(ApiResponse.success("Orders page fetched successfully", orderService.getOrdersPage(page, size)));
        }
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

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<List<Complaint>>> getAllComplaints() {
        return ResponseEntity.ok(ApiResponse.success("Complaints fetched successfully", complaintService.getAllComplaints()));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ApiResponse<Complaint>> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.getOrDefault("status", "ADDRESSED");
        Complaint.ComplaintStatus status = Complaint.ComplaintStatus.valueOf(statusStr.toUpperCase());
        Complaint updated = complaintService.updateComplaintStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated successfully", updated));
    }
}
