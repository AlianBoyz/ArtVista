package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Order;
import java.util.List;

public interface OrderService {

    Order placeOrder(Order order);

    Order checkoutFromCart(Long userId, Order.PaymentType paymentType, String paymentId);

    List<Order> getOrdersByUser(Long userId);

    List<Order> getAllOrders();

    Order getOrderById(Long orderId);

    List<Order> getOrdersByPaintingId(Long paintingId);

    Order updateOrderStatus(Long orderId, Order.OrderStatus status);
}
