package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.CashfreeService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class CashfreeServiceImpl implements CashfreeService {

    @Value("${cashfree.client.id}")
    private String clientId;

    @Value("${cashfree.client.secret}")
    private String clientSecret;

    @Value("${cashfree.api.version}")
    private String apiVersion;

    @Value("${cashfree.environment}")
    private String environment;

    private final UserRepository userRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    public CashfreeServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Map<String, Object> createOrder(Long userId, double amount) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        String url = environment.equalsIgnoreCase("SANDBOX") 
                ? "https://sandbox.cashfree.com/pg/orders" 
                : "https://api.cashfree.com/pg/orders";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-client-id", clientId);
        headers.set("x-client-secret", clientSecret);
        headers.set("x-api-version", apiVersion);

        Map<String, Object> orderRequest = new HashMap<>();
        orderRequest.put("order_id", "ORDER_" + UUID.randomUUID().toString().substring(0, 8));
        orderRequest.put("order_amount", amount);
        orderRequest.put("order_currency", "INR");

        Map<String, String> customerDetails = new HashMap<>();
        customerDetails.put("customer_id", "CUST_" + userId);
        customerDetails.put("customer_name", user.getName());
        customerDetails.put("customer_email", user.getEmail());
        customerDetails.put("customer_phone", "9999999999"); // Placeholder phone
        orderRequest.put("customer_details", customerDetails);

        Map<String, String> orderMeta = new HashMap<>();
        orderMeta.put("return_url", "http://localhost:5173/orders?order_id={order_id}"); // Update this as needed
        orderRequest.put("order_meta", orderMeta);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(orderRequest, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        
        if (response.getStatusCode() == HttpStatus.OK || response.getStatusCode() == HttpStatus.CREATED) {
            return response.getBody();
        } else {
            throw new Exception("Failed to create Cashfree order: " + response.getBody());
        }
    }
}
