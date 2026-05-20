package com.portfolio.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfolio.backend.model.Estudio;
import com.portfolio.backend.repository.EstudioRepository;

@Service
public class EstudioService {

    @Autowired
    private EstudioRepository estudioRepository;

    @Transactional(readOnly = true)
    public List<Estudio> obtenerTodos() {
        return estudioRepository.findAll();
    }

    @Transactional
    public Estudio guardarEstudio(Estudio estudio) {
        // Aquí en el futuro puedes agregar validaciones antes de guardar
        return estudioRepository.save(estudio);
    }

    @Transactional
    public void eliminarEstudio(Long id) {
        estudioRepository.deleteById(id);
    }
}