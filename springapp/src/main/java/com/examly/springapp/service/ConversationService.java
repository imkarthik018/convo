package com.examly.springapp.service;

import com.examly.springapp.model.Conversation;
import com.examly.springapp.repository.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
}