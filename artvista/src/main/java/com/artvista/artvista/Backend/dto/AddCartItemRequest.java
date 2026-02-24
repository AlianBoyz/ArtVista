package com.artvista.artvista.Backend.dto;

public class AddCartItemRequest {
    private Long userId;
    private Long paintingId;
    private Integer quantity;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getPaintingId() {
        return paintingId;
    }

    public void setPaintingId(Long paintingId) {
        this.paintingId = paintingId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
