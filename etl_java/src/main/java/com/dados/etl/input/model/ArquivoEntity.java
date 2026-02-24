package com.dados.etl.input.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "arquivo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArquivoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String state;
    private String city;
    private String place_type;
    private String confirmed;
    private String deaths;
    private String order_for_place;
    private String is_last;
    private String estimated_population_2019;
    private String estimated_population;
    private String city_ibge_code;
    private String confirmed_per_100k_inhabitants;
    private String death_rate;
    
}
