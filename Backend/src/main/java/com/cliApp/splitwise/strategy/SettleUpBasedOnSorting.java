package com.cliApp.splitwise.strategy;

import com.cliApp.splitwise.dto.response.TransactionDTO;
import com.cliApp.splitwise.model.Expense;

import java.util.List;

public class SettleUpBasedOnSorting implements SettleUpStrategy {
    @Override
    public List<TransactionDTO> settleTheExpense(List<Expense> expenses) {
        return List.of();
    }
}
