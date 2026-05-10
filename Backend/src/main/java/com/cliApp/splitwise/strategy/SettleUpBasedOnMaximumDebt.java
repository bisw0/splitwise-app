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

    public static class UserAmount{
        private User user;
        private int amount;
        public UserAmount(User user, int amount){
            this.user=user;
            this.amount = amount;
        }

    }
    @Override
    public List<TransactionDTO> settleTheExpense(List<Expense> expenses) {
        Map<User, Integer> userMap = new HashMap<>();
        for (Expense expense : expenses) {
            for (ReceiverOrPayer rOPye : expense.getUserInTransaction()) {
                if (rOPye.getUserTransactionType() == UserTransactionType.PAYMENT_MAKER) {
                    // Payer gets a positive balance (owed money)
                    userMap.merge(rOPye.getUser(), rOPye.getAmount(), Integer::sum);
                } else {
                    // Receiver gets a negative balance (owes money)
                    userMap.merge(rOPye.getUser(), -rOPye.getAmount(), Integer::sum);
                }
            }
        }

        PriorityQueue<UserAmount> receivers = new PriorityQueue<>((a, b) -> b.amount - a.amount);
        PriorityQueue<UserAmount> senders = new PriorityQueue<>((a, b) -> b.amount - a.amount);

        for (Map.Entry<User, Integer> entry : userMap.entrySet()) {
            if (entry.getValue() > 0) {
                receivers.add(new UserAmount(entry.getKey(), entry.getValue()));
            } else if (entry.getValue() < 0) {
                senders.add(new UserAmount(entry.getKey(), Math.abs(entry.getValue())));
            }
        }

        List<TransactionDTO> transactionDTOS = new ArrayList<>();
        while (!receivers.isEmpty() && !senders.isEmpty()) {
            UserAmount r = receivers.poll();
            UserAmount s = senders.poll();

            int settledAmount = Math.min(r.amount, s.amount);
            transactionDTOS.add(new TransactionDTO(s.user.getName(), settledAmount, r.user.getName()));

            r.amount -= settledAmount;
            s.amount -= settledAmount;

            if (r.amount > 0) receivers.add(r);
            if (s.amount > 0) senders.add(s);
        }
        return transactionDTOS;
    }
}
