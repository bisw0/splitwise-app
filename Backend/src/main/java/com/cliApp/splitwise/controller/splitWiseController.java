package com.cliApp.splitwise.controller;

import com.cliApp.splitwise.dto.request.GroupSetleupRequestDTO;
import com.cliApp.splitwise.dto.response.GroupSetleupResponseDTO;
import com.cliApp.splitwise.dto.response.ResponseStatus;
import com.cliApp.splitwise.dto.response.TransactionDTO;
import com.cliApp.splitwise.service.SettleUpService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class splitWiseController {
    private SettleUpService settleUpService;

    public splitWiseController(SettleUpService settleUpService)
    {
        this.settleUpService= settleUpService;
    }
    @PostMapping("/{groupId}/settleUp")
    public GroupSetleupResponseDTO settleUpForTheGroup(@PathVariable int groupId)
    {
        GroupSetleupResponseDTO response = new GroupSetleupResponseDTO();
        List<TransactionDTO> transactionDTOS;
        try{
            transactionDTOS = settleUpService.settleUpGroup(groupId);
            response.setTransactions(transactionDTOS);
            response.setResponseStatus(ResponseStatus.SUCCESS);
        }
        catch (Exception e)
        {
            response.setResponseStatus(ResponseStatus.FAILURE);
        }
        return response;
    }
}
