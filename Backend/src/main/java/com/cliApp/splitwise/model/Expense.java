package com.cliApp.splitwise.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Expense extends BaseModel{
    @Enumerated(EnumType.STRING)
    private ExpenseType expenseType;
    private int amount;
    @ManyToOne
    @JoinColumn(name = "group_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Group group;
    @OneToMany(mappedBy = "expense", fetch = FetchType.LAZY)
    private List<ReceiverOrPayer> userInTransaction;

}
