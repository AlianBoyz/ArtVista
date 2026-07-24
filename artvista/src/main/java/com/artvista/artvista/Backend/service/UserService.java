package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.dto.UpdateAddressRequest;
import com.artvista.artvista.Backend.model.User;
import org.springframework.data.domain.Page;
import java.util.List;

public interface UserService {

    User register(User user);

    User getUserById(Long id);

    List<User> getAllUsers();

    Page<User> getUsersPage(int page, int size);

    User updateAddress(Long id, UpdateAddressRequest request);

    void deleteUser(Long id);
}
