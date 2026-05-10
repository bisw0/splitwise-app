package com.cliApp.splitwise.service;

import com.cliApp.splitwise.dto.request.ExpenseRequestDTO;
import com.cliApp.splitwise.dto.request.ParticipantDTO;
import com.cliApp.splitwise.model.*;
import com.cliApp.splitwise.repository.ExpenseRepository;
import com.cliApp.splitwise.repository.GroupRepository;
import com.cliApp.splitwise.repository.ReceiverOrPayerRepository;
import com.cliApp.splitwise.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ExpenseService {

    private ExpenseRepository expenseRepository;
    private GroupRepository groupRepository;
    private UserRepository userRepository;
    private ReceiverOrPayerRepository receiverOrPayerRepository;

    @Transactional
    public Expense createExpense(ExpenseRequestDTO request) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new RuntimeException("Group not found"));

        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setExpenseType(ExpenseType.MONEYSPENT);
        expense.setGroup(group);

        expense = expenseRepository.save(expense);

        List<ReceiverOrPayer> transactions = new ArrayList<>();

        for (ParticipantDTO payer : request.getPaidBy()) {
            ReceiverOrPayer rp = new ReceiverOrPayer();
            User user = userRepository.findById(payer.getUserId()).orElseThrow();
            rp.setUser(user);
            rp.setAmount(payer.getAmount());
            rp.setUserTransactionType(UserTransactionType.PAYMENT_MAKER);
            rp.setExpense(expense);
            transactions.add(receiverOrPayerRepository.save(rp));
        }

        for (ParticipantDTO owed : request.getOwedBy()) {
            ReceiverOrPayer rp = new ReceiverOrPayer();
            User user = userRepository.findById(owed.getUserId()).orElseThrow();
            rp.setUser(user);
            rp.setAmount(owed.getAmount());
            rp.setUserTransactionType(UserTransactionType.PAYMENT_RECEIVER);
            rp.setExpense(expense);
            transactions.add(receiverOrPayerRepository.save(rp));
        }

        expense.setUserInTransaction(transactions);
        return expense;
    }
}
