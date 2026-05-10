package com.cliApp.splitwise.repository;

import com.cliApp.splitwise.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group,Integer> {
    List<Group> findAllByUsersId(int userId);
}
