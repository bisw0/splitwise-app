package com.cliApp.splitwise.controller;

import com.cliApp.splitwise.dto.request.UserRequestDTO;
import com.cliApp.splitwise.model.User;
import com.cliApp.splitwise.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private UserService userService;

    @PostMapping
    public User createUser(@RequestBody UserRequestDTO request) {
        return userService.createUser(request.getName(), request.getEmail(), request.getPhoneNo());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
