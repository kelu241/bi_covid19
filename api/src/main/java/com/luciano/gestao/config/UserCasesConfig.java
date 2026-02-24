package com.luciano.gestao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.luciano.gestao.usecases.CasosCovidService;


@Configuration
public class UserCasesConfig {

    @Bean
    public CasosCovidService casosCovidServiceUseCases() {
        return new CasosCovidService();
    }

    
}
