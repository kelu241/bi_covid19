package com.dados.etl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dados.etl.input.Leitura;
import com.dados.etl.output.EscritaArquivo;

@RestController
@RequestMapping("/etl")
public class Controller {

    @Autowired
    private Leitura leitura;

    @Autowired
    private EscritaArquivo escrita;

    @GetMapping("/carregar")
    public ResponseEntity<String> carregarDados() {
        // Lógica para carregar os dados

            


		leitura.lerArquivosDaPasta("./data");

		escrita.enviarArquivosPorBcp("./data");
          
        return ResponseEntity.ok("Dados carregados com sucesso!");

    }
}