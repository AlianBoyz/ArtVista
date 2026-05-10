package com.artvista.artvista.Backend.service;

import java.util.Map;

public interface CashfreeService {
    Map<String, Object> createOrder(Long userId, double amount) throws Exception;
}
