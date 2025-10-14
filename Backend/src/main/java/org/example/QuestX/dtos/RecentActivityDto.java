package org.example.QuestX.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecentActivityDto {
    private String message;
    private String time;
    private String type;
}
