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
    @Column(name = "group_name")
    private String groupName;
    
    @ManyToMany
    private List<User> users;
    
    @ManyToOne
    private User groupCreator;
    
    @ManyToMany
    @JoinTable(
        name = "group_admins",
        joinColumns = @JoinColumn(name = "group_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> groupAdmins;
    
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private List<Expense> expenses;

    @Transient
    private boolean resolved;
}
