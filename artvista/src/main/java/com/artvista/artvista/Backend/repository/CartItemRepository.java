package com.artvista.artvista.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.artvista.artvista.Backend.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCartId(Long cartId);

    List<CartItem> findByCartUserId(Long userId);

    List<CartItem> findByPaintingId(Long paintingId);

    CartItem findByCartUserIdAndPaintingId(Long userId, Long paintingId);
}
