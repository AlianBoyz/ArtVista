package com.artvista.artvista.Backend.service.impl;

import com.artvista.artvista.Backend.dto.CreateComplaintRequest;
import com.artvista.artvista.Backend.exception.ResourceNotFoundException;
import com.artvista.artvista.Backend.model.Complaint;
import com.artvista.artvista.Backend.model.User;
import com.artvista.artvista.Backend.repository.ComplaintRepository;
import com.artvista.artvista.Backend.repository.UserRepository;
import com.artvista.artvista.Backend.service.ComplaintService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Complaint createComplaint(CreateComplaintRequest request) {
        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }

        Complaint complaint = new Complaint();
        complaint.setUser(user);
        complaint.setName(request.getName());
        complaint.setEmail(request.getEmail());
        complaint.setSubject(request.getSubject());
        complaint.setMessage(request.getMessage());
        complaint.setStatus(Complaint.ComplaintStatus.PENDING);

        return complaintRepository.save(complaint);
    }

    @Override
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Complaint updateComplaintStatus(Long id, Complaint.ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found with id: " + id));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
}
