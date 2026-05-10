package com.cliApp.splitwise.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserSetleupResponseDTO {
    List<TransactionDTO> transactions;
    ResponseStatus responseStatus;
}
