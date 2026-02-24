package com.artvista.artvista.Backend.service.service_implementation;

import com.artvista.artvista.Backend.service.AdminService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    @Value("${admin.emails}")
    private String adminEmails;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public boolean isAdmin(String email, String password) {
        List<String> adminEmailList = Arrays.stream(adminEmails.split(","))
                .map(String::trim)
                .toList();
        return adminEmailList.contains(email) && adminPassword.equals(password);
    }
}
