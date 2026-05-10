package com.cliApp.splitwise.controller;

import com.cliApp.splitwise.dto.request.ExpenseRequestDTO;
import com.cliApp.splitwise.model.Expense;
import com.cliApp.splitwise.service.ExpenseService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/expenses")
@AllArgsConstructor
public class ExpenseController {

    private ExpenseService expenseService;

    @PostMapping
    public Expense createExpense(@RequestBody ExpenseRequestDTO request) {
        return expenseService.createExpense(request);
    }
}
