package org.example.QuestX.dtos;

import lombok.Data;

@Data
public class EsewaInitiateResponse {
    public String amount;
    public int total_amount;
    public String transaction_uuid; // same as your transactionId (pid)
    public String product_code; // merchant code
    public String success_url;
    public String failure_url;
    public String signed_field_names;
    public String signature;
}
