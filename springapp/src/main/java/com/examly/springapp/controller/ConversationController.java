package com.examly.springapp.controller;

import com.examly.springapp.model.Conversation;
import com.examly.springapp.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    
    @GetMapping("/conversations")
    public ResponseEntity<Page<Conversation>> getConversations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getConversations(pageable));
    }
    
    @GetMapping("/conversationsByCategory")
    public ResponseEntity<Page<Conversation>> getConversationsByCategory(
            @RequestParam String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getConversationsByCategory(category, pageable));
    }
    
    @GetMapping("/conversationsSortedByTime")
    public ResponseEntity<Page<Conversation>> getConversationsSortedByTime(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getConversationsSortedByTime(pageable));
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