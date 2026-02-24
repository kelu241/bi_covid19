package com.dados.etl.output;

import com.dados.etl.input.model.ArquivoEntity;
import com.dados.etl.persistence.ArquivoJPA;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Component
public class EscritaArquivo {

	private final ArquivoJPA arquivoJPA;
	private final JdbcTemplate jdbcTemplate;

	private static final String INSERT_SQL = """
		INSERT INTO arquivo (
			date, state, city, place_type, confirmed, deaths,
			order_for_place, is_last, estimated_population_2019,
			estimated_population, city_ibge_code,
			confirmed_per_100k_inhabitants, death_rate
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""";

	public EscritaArquivo(ArquivoJPA arquivoJPA, JdbcTemplate jdbcTemplate) {
		this.arquivoJPA = arquivoJPA;
		this.jdbcTemplate = jdbcTemplate;
	}

	@Transactional
	public void enviarArquivosPorBcp(String pasta) {
		// arquivoJPA.limparDW();
		// arquivoJPA.limparStageArquivos();
		File dir = new File(pasta);
		File[] arquivos = dir.listFiles((d, name) -> name.startsWith("saida_") && name.endsWith(".csv"));

		if (arquivos == null || arquivos.length == 0) {
			System.out.println("Nenhum arquivo com prefixo 'saida_' encontrado em " + pasta);
			return;
		}

		for (File arquivo : arquivos) {
			System.out.println("Carregando para o banco: " + arquivo.getAbsolutePath());
			try {
				salvarCsvNoBanco(arquivo.toPath());
				try {
					Files.deleteIfExists(arquivo.toPath());
					System.out.println("Arquivo removido: " + arquivo.getAbsolutePath());
				} catch (IOException e) {
					System.err.println("Não foi possível excluir o arquivo " + arquivo.getName() + ": " + e.getMessage());
				}
			} catch (IOException e) {
				System.err.println("Erro ao carregar arquivo " + arquivo.getName() + " para o banco: " + e.getMessage());
			}
		}

		arquivoJPA.processarDW();
	}

	private void salvarCsvNoBanco(Path csvPath) throws IOException {
		List<ArquivoEntity> buffer = new ArrayList<>();
		int batchSize = 500;

		try (Stream<String> linhas = Files.lines(csvPath, StandardCharsets.UTF_8)) {
			linhas
					.skip(1) // pula cabeçalho
					.filter(l -> !l.isBlank())
					.forEach(linha -> {
						ArquivoEntity entity = mapearLinhaParaEntity(linha);
						buffer.add(entity);
						if (buffer.size() >= batchSize) {
							salvarBatchJdbc(buffer);
							buffer.clear();
						}
					});
		}

		if (!buffer.isEmpty()) {
			salvarBatchJdbc(buffer);
		}
	}

	private void salvarBatchJdbc(List<ArquivoEntity> entidades) {
		jdbcTemplate.batchUpdate(INSERT_SQL, new BatchPreparedStatementSetter() {
			@Override
			public void setValues(java.sql.PreparedStatement ps, int i) throws SQLException {
				ArquivoEntity e = entidades.get(i);
				ps.setString(1, e.getDate());
				ps.setString(2, e.getState());
				ps.setString(3, e.getCity());
				ps.setString(4, e.getPlace_type());
				ps.setString(5, e.getConfirmed());
				ps.setString(6, e.getDeaths());
				ps.setString(7, e.getOrder_for_place());
				ps.setString(8, e.getIs_last());
				ps.setString(9, e.getEstimated_population_2019());
				ps.setString(10, e.getEstimated_population());
				ps.setString(11, e.getCity_ibge_code());
				ps.setString(12, e.getConfirmed_per_100k_inhabitants());
				ps.setString(13, e.getDeath_rate());
			}

			@Override
			public int getBatchSize() {
				return entidades.size();
			}
		});
	}

	private ArquivoEntity mapearLinhaParaEntity(String linha) {
		String[] partes = linha.split(";");
		ArquivoEntity entity = new ArquivoEntity();
		entity.setDate(getValor(partes, 0));
		entity.setState(getValor(partes, 1));
		entity.setCity(getValor(partes, 2));
		entity.setPlace_type(getValor(partes, 3));
		entity.setConfirmed(getValor(partes, 4));
		entity.setDeaths(getValor(partes, 5));
		entity.setOrder_for_place(getValor(partes, 6));
		entity.setIs_last(getValor(partes, 7));
		entity.setEstimated_population_2019(getValor(partes, 8));
		entity.setEstimated_population(getValor(partes, 9));
		entity.setCity_ibge_code(getValor(partes, 10));
		entity.setConfirmed_per_100k_inhabitants(getValor(partes, 11));
		entity.setDeath_rate(getValor(partes, 12));
		return entity;
	}

	private String getValor(String[] partes, int index) {
		return index < partes.length ? partes[index] : "";
	}


	public void limparDw() {
		arquivoJPA.limparDW();
	}


	public void limparStageArquivos() {
		arquivoJPA.limparStageArquivos();
	}
}


