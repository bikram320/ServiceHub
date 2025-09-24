package org.example.QuestX.dtos;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FeedbackDto {

    private String username;
    private String comment;
    private float rating;
    private LocalDateTime date;
}
