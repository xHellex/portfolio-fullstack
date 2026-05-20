package com.portfolio.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfolio.backend.model.Experiencia;
import com.portfolio.backend.repository.ExperienciaRepository;

@Service
public class ExperienciaService {

    @Autowired
    private ExperienciaRepository experienciaRepository;

    @Transactional(readOnly = true)
    public List<Experiencia> obtenerTodas() {
        return experienciaRepository.findAll();
    }

    @Transactional
    public Experiencia guardarExperiencia(Experiencia experiencia) {
        return experienciaRepository.save(experiencia);
    }

    @Transactional
    public void eliminarExperiencia(Long id) {
        experienciaRepository.deleteById(id);
    }
}