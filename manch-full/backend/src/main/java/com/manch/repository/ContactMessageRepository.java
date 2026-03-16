package com.manch.repository;
import com.manch.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, String> {}
