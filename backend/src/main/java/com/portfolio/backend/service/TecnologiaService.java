package com.portfolio.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.portfolio.backend.model.Tecnologia;
import com.portfolio.backend.repository.TecnologiaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TecnologiaService {

    private final TecnologiaRepository tecnologiaRepository;

    public List<Tecnologia> obtenerTodas() {
        return tecnologiaRepository.findAll();
    }

    public Tecnologia guardarTecnologia(Tecnologia tecnologia) {
        return tecnologiaRepository.save(tecnologia);
    }

    public Optional<Tecnologia> buscarPorId(Long id) {
        return tecnologiaRepository.findById(id);
    }
}