package com.cliApp.splitwise.service;

import com.cliApp.splitwise.dto.response.TransactionDTO;
import com.cliApp.splitwise.model.Expense;
import com.cliApp.splitwise.model.Group;
import com.cliApp.splitwise.repository.GroupRepository;
import com.cliApp.splitwise.strategy.SettleUpStrategy;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class SettleUpService {
    private SettleUpStrategy settleUpStrategy;
    private GroupRepository groupRepository;
    public List<TransactionDTO> settleUpGroup(int groupId) {
        Group group = groupRepository.findById(groupId).orElseThrow(
                ()-> new RuntimeException("Group Not present")
        );
        List<Expense> expenses = group.getExpenses();

        return settleUpStrategy.settleTheExpense(expenses);
    }
}
