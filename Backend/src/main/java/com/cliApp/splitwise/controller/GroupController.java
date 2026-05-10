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

    @GetMapping("/user/{userId}")
    public List<Group> getGroupsByUserId(@PathVariable int userId) {
        return groupService.getGroupsByUserId(userId);
    }

    @GetMapping("/{id}")
    public Group getGroupById(@PathVariable int id) {
        return groupService.getGroupById(id);
    }

    @PostMapping("/{id}/members")
    public Group addMember(@PathVariable int id, @RequestBody java.util.Map<String, Integer> body) {
        return groupService.addMemberToGroup(id, body.get("userId"));
    }

    @PostMapping("/{id}/admins")
    public Group addAdmin(@PathVariable int id, @RequestBody java.util.Map<String, Integer> body) {
        return groupService.addAdminToGroup(id, body.get("userId"));
    }
}
