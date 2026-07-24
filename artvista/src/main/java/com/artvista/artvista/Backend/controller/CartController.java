package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.AddCartItemRequest;
import com.artvista.artvista.Backend.model.Cart;
import com.artvista.artvista.Backend.model.CartItem;
import com.artvista.artvista.Backend.service.CartService;
import com.artvista.artvista.Backend.util.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    @GetMapping("/my-cart")
    public ResponseEntity<ApiResponse<Cart>> getMyCart(HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", cartService.getCartByUserId(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Cart>> saveCart(@RequestBody Cart cart) {
        return ResponseEntity.ok(ApiResponse.success("Cart saved successfully", cartService.saveCart(cart)));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartItem>> addPaintingToCart(@RequestBody AddCartItemRequest addRequest, HttpServletRequest request) {
        Long userId = getAuthenticatedUserId(request);
        CartItem item = cartService.addPaintingToCart(userId, addRequest.getPaintingId(), addRequest.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Painting added to cart successfully", item));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Void>> removeItemFromCart(@PathVariable Long itemId) {
        cartService.removeItemFromCart(itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart successfully", null));
    }

    private Long getAuthenticatedUserId(HttpServletRequest request) {
        Object value = request.getAttribute("authenticatedUserId");
        if (value instanceof Number number) {
            return number.longValue();
        }
        throw new IllegalArgumentException("Authenticated user id not found in token");
    }
}
