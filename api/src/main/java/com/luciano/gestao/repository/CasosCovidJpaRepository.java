package com.luciano.gestao.repository;


import com.luciano.gestao.model.CasosCovid;
import com.luciano.gestao.model.CovidByDateView;
import com.luciano.gestao.model.CovidEvolutionView;
import com.luciano.gestao.model.CovidTotalsView;
import com.luciano.gestao.model.TopDeathCityView;

import java.math.BigInteger;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CasosCovidJpaRepository extends JpaRepository<CasosCovid, BigInteger> {

   
    @Query(value = "SELECT * FROM dbo.fn_CovidEvolution_UntilDate(:data)", nativeQuery = true)
    List<CovidEvolutionView> evolucaoCasos(@Param("data") LocalDate data);

    @Query(value = "SELECT * FROM dbo.fn_CovidTotals_ByDate(:data)", nativeQuery = true)
    List<CovidTotalsView> totaisCasos(@Param("data") LocalDate data);
    
    @Query(value = "SELECT * FROM dbo.fn_FactCovid_ByDate(:data)", nativeQuery = true)
    List<CovidByDateView> casosCovid(@Param("data") LocalDate data);

    @Query(value = "SELECT * FROM dbo.fn_TopDeathCity_ByDate(:data)", nativeQuery = true)
    List<TopDeathCityView> mortalidadeCovid(@Param("data") LocalDate data);

    

}