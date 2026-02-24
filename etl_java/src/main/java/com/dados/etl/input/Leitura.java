package com.dados.etl.input;

import com.dados.etl.input.model.ArquivoEntity;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.stream.Stream;

@Component
public class Leitura {

    public void lerArquivosDaPasta(String caminhoPasta) {
        File pasta = new File(caminhoPasta);
        File[] arquivos = pasta.listFiles();
        if (arquivos != null) {
            for (File arquivo : arquivos) {
                if (arquivo.isFile()) {
                    System.out.println("Processando arquivo: " + arquivo.getName());

                    Path inputPath = arquivo.toPath();
                    Path outputPath = Paths.get(arquivo.getParent(), "saida_" + arquivo.getName());

                    try (Stream<String> linhas = Files.lines(inputPath);
                         BufferedWriter writer = Files.newBufferedWriter(outputPath,
                                 StandardCharsets.UTF_8,
                                 StandardOpenOption.CREATE,
                                 StandardOpenOption.TRUNCATE_EXISTING)) {

                        linhas
                            .filter(linha -> !linha.isEmpty())
                            .forEach(linha -> {
                                ArquivoEntity model = mapearLinhaParaArquivoEntity(linha);
                                String linhaSaida = converterModelParaLinha(model);
                                try {
                                    writer.write(linhaSaida);
                                    writer.newLine();
                                } catch (IOException e) {
                                    throw new UncheckedIOException(e);
                                }
                            });

                    } catch (IOException | UncheckedIOException e) {
                        System.err.println("Erro ao processar o arquivo: " + arquivo.getName() + ": " + e.getMessage());
                    }
                }
            }
        } else {
            System.err.println("Erro ao acessar a pasta: " + caminhoPasta);
        }
    }

    private ArquivoEntity mapearLinhaParaArquivoEntity(String linha) {
        // Ajuste o delimitador (";" ou ",") conforme o formato real do seu CSV
        String[] partes = linha.split(",");

        return new ArquivoEntity(
                null, getValor(partes, 0),
                getValor(partes, 1),
                getValor(partes, 2),
                getValor(partes, 3),
                getValor(partes, 4),
                getValor(partes, 5),
                getValor(partes, 6),
                getValor(partes, 7),
                getValor(partes, 8),
                getValor(partes, 9),
                getValor(partes, 10),
                getValor(partes, 11),
                getValor(partes, 12)
        );
    }

    private String converterModelParaLinha(ArquivoEntity m) {
        // Mesmo delimitador usado na leitura
        return String.join(";",
                m.getDate(),
                m.getState(),
                m.getCity(),
                m.getPlace_type(),
                m.getConfirmed(),
                m.getDeaths(),
                m.getOrder_for_place(),
                m.getIs_last(),
                m.getEstimated_population_2019(),
                m.getEstimated_population(),
                m.getCity_ibge_code(),
                m.getConfirmed_per_100k_inhabitants(),
                m.getDeath_rate()
        );
    }

    private String getValor(String[] partes, int index) {
        return index < partes.length ? partes[index] : "";
    }
}
