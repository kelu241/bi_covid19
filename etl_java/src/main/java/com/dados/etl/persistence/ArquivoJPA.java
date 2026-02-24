package com.dados.etl.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import com.dados.etl.input.model.ArquivoEntity;

public interface ArquivoJPA extends JpaRepository<ArquivoEntity, Long> {
    
    @Modifying
    @Transactional
    @Query(value = "EXEC [dbo].[usp_Load_CovidDW]", nativeQuery = true)
    void processarDW();

    @Modifying
    @Transactional
    @Query(value = "EXEC [dbo].[usp_Clean_CovidDW]", nativeQuery = true)
    void limparDW();

    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE [dbo].[arquivos]", nativeQuery = true)
    void limparStageArquivos();
    
    
}
