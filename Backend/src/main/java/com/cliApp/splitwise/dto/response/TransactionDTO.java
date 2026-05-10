package com.cliApp.splitwise.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionDTO {
    private String paidBy ;
    private int ammountPaid;
    private String paidTo;
}
