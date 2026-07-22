package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.dto.CreateComplaintRequest;
import com.artvista.artvista.Backend.model.Complaint;

import java.util.List;

public interface ComplaintService {
    Complaint createComplaint(CreateComplaintRequest request);
    List<Complaint> getAllComplaints();
    Complaint updateComplaintStatus(Long id, Complaint.ComplaintStatus status);
}
