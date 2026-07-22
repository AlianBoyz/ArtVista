package com.artvista.artvista.Backend.controller;

import com.artvista.artvista.Backend.dto.CreateComplaintRequest;
import com.artvista.artvista.Backend.model.Complaint;
import com.artvista.artvista.Backend.service.ComplaintService;
import com.artvista.artvista.Backend.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Complaint>> submitComplaint(@RequestBody CreateComplaintRequest request) {
        Complaint complaint = complaintService.createComplaint(request);
        return ResponseEntity.ok(ApiResponse.success("Complaint submitted successfully", complaint));
    }
}
