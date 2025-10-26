package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String prompt;
    private String response;
    private String category;
    private String timestamp;
    
    // Explicitly define setId to ensure it's available
    public void setId(Long id) {
        this.id = id;
    }
}