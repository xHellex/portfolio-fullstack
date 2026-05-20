package com.portfolio.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.backend.model.Perfil;
import com.portfolio.backend.service.PerfilService;

@RestController
@RequestMapping("/api/v1/perfil")
@CrossOrigin(origins = "http://localhost:5173")
public class PerfilController {

    @Autowired
    private PerfilService perfilService;

    @GetMapping
    public Perfil getPerfil() {
        return perfilService.obtenerPerfil(); // Fíjate que no devuelve una Lista, sino un solo objeto
    }

    @PostMapping
    public Perfil savePerfil(@RequestBody Perfil perfil) {
        return perfilService.guardarPerfil(perfil);
    }
}