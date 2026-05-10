package com.cliApp.splitwise.strategy;

import com.cliApp.splitwise.dto.response.TransactionDTO;
import com.cliApp.splitwise.model.Expense;
import com.cliApp.splitwise.model.ReceiverOrPayer;
import com.cliApp.splitwise.model.User;
import com.cliApp.splitwise.model.UserTransactionType;

import java.util.*;

import org.springframework.stereotype.Component;

@Component
public class SettleUpBasedOnMaximumDebt implements SettleUpStrategy{
    public static class UserTransaction {
        User user;
        int amount;

        public UserTransaction(User user, int amount) {
            this.user = user;
            this.amount = amount;
        }
    }

    @Override
    public List<TransactionDTO> settleTheExpense(List<Expense> expenses) {
        Map<User, Integer> mapOfUsers = new HashMap<>();
        for(var expense: expenses) {
            for(ReceiverOrPayer rOrP : expense.getUserInTransaction()) {
                if(rOrP.getUserTransactionType() == UserTransactionType.PAYMENT_MAKER) {
                    mapOfUsers.merge(rOrP.getUser(), rOrP.getAmount(), Integer::sum);
                } else {
                    mapOfUsers.merge(rOrP.getUser(), -rOrP.getAmount(), Integer::sum);
                }
            }
        }

        PriorityQueue<UserTransaction> receivers = new PriorityQueue<>((a, b) -> b.amount - a.amount);
        PriorityQueue<UserTransaction> payers = new PriorityQueue<>((a, b) -> b.amount - a.amount);

        for (Map.Entry<User, Integer> entry : mapOfUsers.entrySet()) {
            if (entry.getValue() > 0) {
                receivers.add(new UserTransaction(entry.getKey(), entry.getValue()));
            } else if (entry.getValue() < 0) {
                payers.add(new UserTransaction(entry.getKey(), Math.abs(entry.getValue())));
            }
        }

        List<TransactionDTO> transactions = new ArrayList<>();

        while (!receivers.isEmpty() && !payers.isEmpty()) {
            UserTransaction receiver = receivers.poll();
            UserTransaction payer = payers.poll();

            int settledAmount = Math.min(receiver.amount, payer.amount);

            TransactionDTO transactionDTO = new TransactionDTO();
            transactionDTO.setPaidBy(payer.user.getName());
            transactionDTO.setPaidTo(receiver.user.getName());
            transactionDTO.setAmmountPaid(settledAmount);
            transactions.add(transactionDTO);

            receiver.amount -= settledAmount;
            payer.amount -= settledAmount;

            if (receiver.amount > 0) {
                receivers.add(receiver);
            }
            if (payer.amount > 0) {
                payers.add(payer);
            }
        }

        return transactions;
    }
}
