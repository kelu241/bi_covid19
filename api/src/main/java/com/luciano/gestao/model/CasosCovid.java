package com.luciano.gestao.model;

import java.math.BigInteger;
import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor

@Entity(name = "FactCovid")

public class CasosCovid {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY) 
   @Column(name = "id", nullable = false)
   private BigInteger id;
   @Column(name = "Datekey", nullable = false)
   private Integer DateKey;                                   
   @Column(name = "LocationKey", nullable = false)
   private Integer LocationKey;                     
   @Column(name = "Confirmed", nullable = false)
   private Integer Confirmed;                       
   @Column(name = "ConfirmedPer100kInhabitants", nullable = false)
   private Double ConfirmedPer100kInhabitants; 
   @Column(name = "Deaths", nullable = false)
   private Integer Deaths;                          
   @Column(name = "DeathRate", nullable = false)
   private Double DeathRate;                   
   @Column(name = "IsLast", nullable = false)
   private Boolean IsLast;                          
   @Column(name = "OrderForPlace", nullable = false)
   private Integer OrderForPlace;                   
   @Column(name = "LoadDttm", nullable = false)
   private Date LoadDttm;                  
}
