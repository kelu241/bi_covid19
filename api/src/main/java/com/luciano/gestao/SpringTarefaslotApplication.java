package com.luciano.gestao;


import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringTarefaslotApplication {
    public static void main(String[] args) {
        // Carrega variáveis do arquivo .env
        Dotenv.configure().ignoreIfMissing().load();
        SpringApplication.run(SpringTarefaslotApplication.class, args);
    }
}
