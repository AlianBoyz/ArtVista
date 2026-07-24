package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Order;
import org.springframework.data.domain.Page;
import java.util.List;

public interface OrderService {

    Order placeOrder(Order order);

    Order checkout(Long userId, Order.PaymentType paymentType, String paymentId, Long paintingId);

    List<Order> getOrdersByUser(Long userId);

    List<Order> getAllOrders();

    Page<Order> getOrdersPage(int page, int size);

    Order getOrderById(Long orderId);

    List<Order> getOrdersByPaintingId(Long paintingId);

    Order updateOrderStatus(Long orderId, Order.OrderStatus status);
}
