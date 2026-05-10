package com.cliApp.splitwise.controller;

import com.cliApp.splitwise.dto.request.GroupRequestDTO;
import com.cliApp.splitwise.model.Group;
import com.cliApp.splitwise.service.GroupService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@AllArgsConstructor
public class GroupController {

    private GroupService groupService;

    @PostMapping
    public Group createGroup(@RequestBody GroupRequestDTO request) {
        return groupService.createGroup(request.getGroupName(), request.getUserIds(), request.getCreatorId());
    }

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/{id}")
    public Group getGroupById(@PathVariable int id) {
        return groupService.getGroupById(id);
    }
}
