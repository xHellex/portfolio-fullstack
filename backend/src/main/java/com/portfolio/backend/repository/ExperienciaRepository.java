package com.portfolio.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.backend.model.Experiencia;

@Repository
public interface ExperienciaRepository extends JpaRepository<Experiencia, Long> {
}