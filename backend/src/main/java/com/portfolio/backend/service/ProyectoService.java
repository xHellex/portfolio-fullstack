package com.portfolio.backend.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.portfolio.backend.model.Proyecto;
import com.portfolio.backend.model.Tecnologia;
import com.portfolio.backend.repository.ProyectoRepository;
import com.portfolio.backend.repository.TecnologiaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor 
public class ProyectoService {

    private final ProyectoRepository proyectoRepository;
    private final TecnologiaRepository tecnologiaRepository; 

    public List<Proyecto> obtenerTodos() {
        return proyectoRepository.findAll();
    }

    public List<Proyecto> obtenerActivos() {
        return proyectoRepository.findByActivoTrue();
    }

    // --- ESTE ES EL MÉTODO QUE ARREGLA EL ERROR 500 ---
    public Proyecto guardarProyecto(Proyecto proyecto) {
        Set<Tecnologia> tecnologiasCompletas = new HashSet<>();
        
        // Si el proyecto viene con tecnologías (solo con el ID)
        if (proyecto.getTecnologias() != null) {
            for (Tecnologia techIncompleta : proyecto.getTecnologias()) {
                // Buscamos la tecnología real en la base de datos para obtener su nombre y categoría
                tecnologiaRepository.findById(techIncompleta.getId())
                        .ifPresent(tecnologiasCompletas::add);
            }
        }
        
        // Reemplazamos la lista incompleta por la lista con todos los datos
        proyecto.setTecnologias(tecnologiasCompletas);
        
        // Ahora sí, guardamos tranquilamente
        return proyectoRepository.save(proyecto);
    }

    public Optional<Proyecto> buscarPorId(Long id) {
        return proyectoRepository.findById(id);
    }

    public void eliminarProyecto(Long id) {
        proyectoRepository.deleteById(id);
    }

    public Proyecto asignarTecnologia(Long proyectoId, Long tecnologiaId) {
        Proyecto proyecto = proyectoRepository.findById(proyectoId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
        Tecnologia tecnologia = tecnologiaRepository.findById(tecnologiaId)
                .orElseThrow(() -> new RuntimeException("Tecnología no encontrada"));

        proyecto.addTecnologia(tecnologia);
        
        return proyectoRepository.save(proyecto);
    }
}