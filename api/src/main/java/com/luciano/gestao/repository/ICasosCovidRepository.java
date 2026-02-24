package com.luciano.gestao.repository;

import java.time.LocalDate;
import java.util.List;

import com.luciano.gestao.model.CasosCovid;
import com.luciano.gestao.model.CovidByDateView;
import com.luciano.gestao.model.CovidEvolutionView;
import com.luciano.gestao.model.CovidTotalsView;
import com.luciano.gestao.model.TopDeathCityView;

public interface ICasosCovidRepository  extends IGerericRepository<CasosCovid> {
    // Herda métodos de ambas as interfaces
    List<CovidEvolutionView> evolucaoCasos(LocalDate data);
    List<CovidTotalsView> totaisCasos(LocalDate data);
    List<CovidByDateView> casosCovid(LocalDate data);
    List<TopDeathCityView> mortalidadeCovid(LocalDate data);
    
}
