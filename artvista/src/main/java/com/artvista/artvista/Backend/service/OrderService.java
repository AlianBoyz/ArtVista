package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.model.Order;
import java.util.List;

public interface OrderService {

    Order placeOrder(Order order);

    List<Order> getOrdersByUser(Long userId);

    List<Order> getAllOrders();
}