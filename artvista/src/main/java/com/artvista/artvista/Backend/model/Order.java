package com.artvista.artvista.Backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Total order amount
    @Column(nullable = false)
    private BigDecimal totalAmount;

    // Razorpay payment id
    @Column(nullable = true)
    private String paymentId;

    // Order creation time
    @Column(name = "order_time")
    private LocalDateTime createdAt=LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_type", nullable = false)
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orrderStatus;
    // Many Orders → One User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"orders", "cart", "password"})
    private User user;

    // One Order → Many OrderItems
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("order")
    private List<OrderItem> items;

     public enum PaymentType {
        COD,
        ONLINE
    }

    public enum OrderStatus{
        ACCEPT,
        REJECT,
        INTRANSIT,
        DELIVERED
    }
    // Default constructor (required by JPA)
    public Order() {
    }
    public Order(Long id, BigDecimal totalAmount, String paymentId, LocalDateTime createdAt, PaymentType paymentType,
            OrderStatus orrderStatus, User user, List<OrderItem> items) {
        this.id = id;
        this.totalAmount = totalAmount;
        this.paymentId = paymentId;
        this.createdAt = createdAt;
        this.paymentType = paymentType;
        this.orrderStatus = orrderStatus;
        this.user = user;
        this.items = items;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
    public String getPaymentId() {
        return paymentId;
    }
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public PaymentType getPaymentType() {
        return paymentType;
    }
    public void setPaymentType(PaymentType paymentType) {
        this.paymentType = paymentType;
    }
    public OrderStatus getOrrderStatus() {
        return orrderStatus;
    }
    public void setOrrderStatus(OrderStatus orrderStatus) {
        this.orrderStatus = orrderStatus;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public List<OrderItem> getItems() {
        return items;
    }
    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}