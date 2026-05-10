package com.cliApp.splitwise.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GroupRequestDTO {
    private String groupName;
    private List<Integer> userIds;
    private int creatorId;
}
