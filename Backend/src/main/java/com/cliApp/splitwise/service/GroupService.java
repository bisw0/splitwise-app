package com.cliApp.splitwise.service;

import com.cliApp.splitwise.model.Group;
import com.cliApp.splitwise.model.User;
import com.cliApp.splitwise.repository.GroupRepository;
import com.cliApp.splitwise.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class GroupService {
    private GroupRepository groupRepository;
    private UserRepository userRepository;

    public Group createGroup(String groupName, List<Integer> userIds, int creatorId) {
        Group group = new Group();
        group.setGroupName(groupName);

        List<User> users = userRepository.findAllById(userIds);
        User creator = userRepository.findById(creatorId).orElseThrow(() -> new RuntimeException("Creator not found"));
        
        if (!users.contains(creator)) {
            users.add(creator);
        }

        group.setUsers(users);
        group.setGroupCreator(creator);
        group.setGroupAdmins(new java.util.ArrayList<>(List.of(creator)));

        return groupRepository.save(group);
    }

    public Group addMemberToGroup(int groupId, int userId) {
        Group group = getGroupById(groupId);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!group.getUsers().contains(user)) {
            group.getUsers().add(user);
        }
        return groupRepository.save(group);
    }

    public Group addAdminToGroup(int groupId, int userId) {
        Group group = getGroupById(groupId);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!group.getUsers().contains(user)) {
            throw new RuntimeException("User must be a group member first");
        }
        
        if (!group.getGroupAdmins().contains(user)) {
            group.getGroupAdmins().add(user);
        }
        return groupRepository.save(group);
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(int id) {
        return groupRepository.findById(id).orElseThrow(() -> new RuntimeException("Group not found"));
    }
}
