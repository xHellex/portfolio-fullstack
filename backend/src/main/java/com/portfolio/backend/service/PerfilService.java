package com.portfolio.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.portfolio.backend.model.Perfil;
import com.portfolio.backend.repository.PerfilRepository;

@Service
public class PerfilService {

    @Autowired
    private PerfilRepository perfilRepository;

    @Transactional(readOnly = true)
    public Perfil obtenerPerfil() {
        List<Perfil> perfiles = perfilRepository.findAll();
        // Si la tabla está vacía, creamos un perfil por defecto automático
        if (perfiles.isEmpty()) {
            Perfil nuevo = new Perfil();
            nuevo.setResumen("Desarrollador Full Stack y estudiante de Analista Computacional. Me apasiona construir arquitecturas robustas y escalables.");
            nuevo.setDisponibilidad(true);
            return perfilRepository.save(nuevo);
        }
        // Si ya existe, devolvemos el primero
        return perfiles.get(0);
    }

    @Transactional
    public Perfil guardarPerfil(Perfil perfil) {
        List<Perfil> existentes = perfilRepository.findAll();
        
        if (existentes.isEmpty()) {
            // Si la base de datos está vacía, lo guardamos como un registro completamente nuevo
            return perfilRepository.save(perfil);
        } else {
            // Si ya existe un perfil, tomamos su ID real de la base de datos y lo sobrescribimos
            perfil.setId(existentes.get(0).getId());
            return perfilRepository.save(perfil);
        }
    }
}