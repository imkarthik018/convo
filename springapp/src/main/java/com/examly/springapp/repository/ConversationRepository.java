package com.examly.springapp.repository;

import com.examly.springapp.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByCategory(String category);
    List<Conversation> findAllByOrderByTimestampDesc();
}