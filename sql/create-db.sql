-- Cria apenas o DATABASE (schema fica com Flyway)
IF DB_ID(N'etljava2') IS NULL
    CREATE DATABASE [etljava2];
GO
