package com.examly.springapp.controller;

import com.examly.springapp.model.Conversation;
import com.examly.springapp.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin
public class ConversationController {
    
    @Autowired
    private ConversationService service;
    
    @PostMapping("/addConversation")
    public ResponseEntity<Conversation> addConversation(@RequestBody Conversation conversation) {
        return ResponseEntity.ok(service.addConversation(conversation));
    }
    
    @GetMapping("/allConversations")
    public ResponseEntity<List<Conversation>> getAllConversations() {
        return ResponseEntity.ok(service.getAllConversations());
    }
    
    @GetMapping("/byCategory")
    public ResponseEntity<List<Conversation>> getConversationsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(service.getConversationsByCategory(category));
    }
    
    @GetMapping("/sortedByTime")
    public ResponseEntity<List<Conversation>> getConversationsSortedByTime() {
        return ResponseEntity.ok(service.getConversationsSortedByTime());
    }
    
    @DeleteMapping("/deleteConversation/{id}")
    public ResponseEntity<Void> deleteConversation(@PathVariable Long id) {
        service.deleteConversation(id);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/updateConversation/{id}")
    public ResponseEntity<Conversation> updateConversation(@PathVariable Long id, @RequestBody Conversation conversation) {
        return ResponseEntity.ok(service.updateConversation(id, conversation));
    }
}