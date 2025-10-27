package com.examly.springapp.service;

import com.examly.springapp.model.Conversation;
import com.examly.springapp.repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConversationService {
    
    @Autowired
    private ConversationRepository repository;
    
    public Conversation addConversation(Conversation conversation) {
        return repository.save(conversation);
    }
    
    public List<Conversation> getAllConversations() {
        return repository.findAll();
    }
    
    public List<Conversation> getConversationsByCategory(String category) {
        return repository.findByCategory(category);
    }
    
    public List<Conversation> getConversationsSortedByTime() {
        return repository.findAllByOrderByTimestampDesc();
    }
    
    public void deleteConversation(Long id) {
        repository.deleteById(id);
    }
    
    public Conversation updateConversation(Long id, Conversation conversation) {
        conversation.setId(id);
        return repository.save(conversation);
    }
    
    // Pagination methods
    public Page<Conversation> getConversations(Pageable pageable) {
        return repository.findAll(pageable);
    }
    
    public Page<Conversation> getConversationsByCategory(String category, Pageable pageable) {
        return repository.findByCategory(category, pageable);
    }
    
    public Page<Conversation> getConversationsSortedByTime(Pageable pageable) {
        return repository.findAllByOrderByTimestampDesc(pageable);
    }
}