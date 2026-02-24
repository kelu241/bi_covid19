package com.luciano.gestao.usecases;


import java.time.LocalDate;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.ResponseEntity;

import com.luciano.gestao.model.CovidByDateView;
import com.luciano.gestao.model.CovidEvolutionView;
import com.luciano.gestao.model.CovidTotalsView;
import com.luciano.gestao.model.TopDeathCityView;

public interface ICasosCovidService {
    CompletableFuture<ResponseEntity<Iterable<CovidEvolutionView>>> casosCovidEvolucao(LocalDate data);
    CompletableFuture<ResponseEntity<Iterable<CovidTotalsView>>> casosCovidTotais(LocalDate data);
    CompletableFuture<ResponseEntity<Iterable<CovidByDateView>>> casosCovidConfirmados(LocalDate data);
    CompletableFuture<ResponseEntity<Iterable<TopDeathCityView>>> mortalidadeCovid(LocalDate data);
}
