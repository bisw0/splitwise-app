package com.cliApp.splitwise.strategy;

import com.cliApp.splitwise.dto.response.TransactionDTO;
import com.cliApp.splitwise.model.Expense;

import java.util.List;

public interface SettleUpStrategy {
    List<TransactionDTO> settleTheExpense(List<Expense> expenses);
}
