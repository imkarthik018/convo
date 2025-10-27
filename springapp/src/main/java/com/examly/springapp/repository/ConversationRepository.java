package com.examly.springapp.repository;

import com.examly.springapp.model.Conversation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByCategory(String category);
    List<Conversation> findAllByOrderByTimestampDesc();
    
    // Pagination methods
    Page<Conversation> findByCategory(String category, Pageable pageable);
    Page<Conversation> findAllByOrderByTimestampDesc(Pageable pageable);
}