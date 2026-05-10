package com.cliApp.splitwise.repository;

import com.cliApp.splitwise.model.ReceiverOrPayer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiverOrPayerRepository extends JpaRepository<ReceiverOrPayer, Integer> {
}
