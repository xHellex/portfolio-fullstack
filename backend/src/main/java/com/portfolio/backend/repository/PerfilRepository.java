package com.portfolio.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.backend.model.Perfil;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {
}