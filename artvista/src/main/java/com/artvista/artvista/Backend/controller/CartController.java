package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.AddCartItemRequest;
import com.artvista.artvista.Backend.model.Cart;
import com.artvista.artvista.Backend.model.CartItem;
import com.artvista.artvista.Backend.service.CartService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Cart>> getCartByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", cartService.getCartByUserId(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Cart>> saveCart(@RequestBody Cart cart) {
        return ResponseEntity.ok(ApiResponse.success("Cart saved successfully", cartService.saveCart(cart)));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartItem>> addPaintingToCart(@RequestBody AddCartItemRequest request) {
        CartItem item = cartService.addPaintingToCart(request.getUserId(), request.getPaintingId(), request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Painting added to cart successfully", item));
    }
}
