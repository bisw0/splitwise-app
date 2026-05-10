package com.cliApp.splitwise.service;

import com.cliApp.splitwise.model.User;
import com.cliApp.splitwise.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    private UserRepository userRepository;

    public User createUser(String name, String email, String phoneNo) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhoneNo(phoneNo);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
