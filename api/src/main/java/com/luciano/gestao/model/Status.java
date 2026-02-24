package com.luciano.gestao.model;

public enum Status {

    PENDENTE("tarefa ainda em aberto"),
    INICIADA("tarefa em progresso"),
    CONCLUIDA("tarefa finalizada"),
    CANCELADA("tarefa cancelada");
    
    private String descricao;

    Status(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}