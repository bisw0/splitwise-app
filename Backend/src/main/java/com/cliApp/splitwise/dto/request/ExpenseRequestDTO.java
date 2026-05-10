package com.cliApp.splitwise.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ExpenseRequestDTO {
    private int amount;
    private int groupId;
    private List<ParticipantDTO> paidBy;
    private List<ParticipantDTO> owedBy;
}
