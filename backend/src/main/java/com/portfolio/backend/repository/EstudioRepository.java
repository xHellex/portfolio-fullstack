package com.portfolio.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.backend.model.Estudio;

@Repository
public interface EstudioRepository extends JpaRepository<Estudio, Long> {
}