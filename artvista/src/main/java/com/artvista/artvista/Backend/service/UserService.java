package com.artvista.artvista.Backend.service;

import com.artvista.artvista.Backend.dto.UpdateAddressRequest;
import com.artvista.artvista.Backend.model.User;
import java.util.List;

public interface UserService {

    User register(User user);

    User getUserById(Long id);

    List<User> getAllUsers();

    User updateAddress(Long id, UpdateAddressRequest request);

    void deleteUser(Long id);
}
