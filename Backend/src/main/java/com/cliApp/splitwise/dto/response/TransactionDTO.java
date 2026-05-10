package com.cliApp.splitwise.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TransactionDTO {
    private String paidBy ;
    private int ammountPaid;
    private String paidTo;
}
