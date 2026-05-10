package com.cliApp.splitwise.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
//import org.hibernate.usertype.UserType;

@Entity
@Getter
@Setter
public class ReceiverOrPayer extends BaseModel{
    @ManyToOne
    private User user;
    @ManyToOne
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Expense expense;
    private int amount;
    @Enumerated(EnumType.STRING)
    private UserTransactionType userTransactionType;
}
