package com.artvista.artvista.Backend.service.service_implementation;
import org.springframework.beans.factory.annotation.Value; 
import org.springframework.stereotype.Service; 
import java.util.Arrays; 
import java.util.List; 
@Service
public class AdminServiceImpl {
    
    @Value("${admin.emails}") 
    private String adminEmails; 
    @Value("${admin.password}") 
    private String adminPassword; 


    // Method to check if admin login is valid 
    
    
    public boolean isAdmin(String email, String password) {
       // Convert comma separated emails into list
       List<String> adminEmailList = Arrays.asList(adminEmails.split(",")); 
       // Check if email exists in admin list 
       if (adminEmailList.contains(email) && adminPassword.equals(password)) { 
           return true; 
       } 
       return false;
    }
}