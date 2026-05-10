package com.cliApp.splitwise.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "splitwise_groups")
public class Group extends BaseModel{
    private String grouName;
    @ManyToMany
    private List<User> users;
    @ManyToOne
    private User groupCreater;
    @ManyToOne
    private User groupAdmin;
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private List<Expense> expenses;
}
