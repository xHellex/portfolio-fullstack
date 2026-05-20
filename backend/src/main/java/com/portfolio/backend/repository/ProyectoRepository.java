package com.portfolio.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.portfolio.backend.model.Proyecto;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
    // Spring crea automáticamente la query por detrás solo nombrando bien el método:
    List<Proyecto> findByActivoTrue(); 
}