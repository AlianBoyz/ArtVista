package com.artvista.artvista.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artvista.artvista.Backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findByItemsPaintingId(Long paintingId);
}
