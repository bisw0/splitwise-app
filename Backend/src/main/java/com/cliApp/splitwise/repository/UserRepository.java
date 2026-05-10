package com.cliApp.splitwise.repository;

import com.cliApp.splitwise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {
}
