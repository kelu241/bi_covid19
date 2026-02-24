-- Migração inicial (schema + objetos)
-- Observação: esta migration não cria o DATABASE; isso fica no container do SQL Server.

SET QUOTED_IDENTIFIER ON
GO

IF OBJECT_ID(N'[dbo].[DimDate]', N'U') IS NULL
BEGIN
  CREATE TABLE [dbo].[DimDate](
    [DateKey] [int] NOT NULL,
    [Date] [date] NOT NULL,
    [Year] [smallint] NOT NULL,
    [Month] [tinyint] NOT NULL,
    [Day] [tinyint] NOT NULL,
    [Quarter] [tinyint] NOT NULL,
    [MonthName] [varchar](15) NOT NULL
  ) ON [PRIMARY]
END
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.key_constraints kc
  WHERE kc.[type] = 'PK'
    AND kc.parent_object_id = OBJECT_ID(N'[dbo].[DimDate]')
)
  ALTER TABLE [dbo].[DimDate] ADD  CONSTRAINT [PK_DimDate] PRIMARY KEY CLUSTERED
  (
    [DateKey] ASC
  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

IF OBJECT_ID(N'[dbo].[UQ_DimDate_Date]', N'UQ') IS NULL
  ALTER TABLE [dbo].[DimDate] ADD  CONSTRAINT [UQ_DimDate_Date] UNIQUE NONCLUSTERED
  (
    [Date] ASC
  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO


-- =========================
-- DimLocation
-- =========================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[DimLocation]', N'U') IS NULL
BEGIN
  CREATE TABLE [dbo].[DimLocation](
    [LocationKey] [int] IDENTITY(1,1) NOT NULL,
    [PlaceType] [varchar](20) NOT NULL,
    [StateCode] [char](2) NOT NULL,
    [CityName] [nvarchar](150) NULL,
    [CityIBGECode] [int] NULL,
    [EstimatedPopulation] [int] NULL,
    [EstimatedPopulation2019] [int] NULL,
    [CityName_NK]  AS (isnull([CityName],N'')) PERSISTED NOT NULL,
    [CityIBGECode_NK]  AS (isnull([CityIBGECode],(-1))) PERSISTED NOT NULL
  ) ON [PRIMARY]
END
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.key_constraints kc
  WHERE kc.[type] = 'PK'
    AND kc.parent_object_id = OBJECT_ID(N'[dbo].[DimLocation]')
)
  ALTER TABLE [dbo].[DimLocation] ADD  CONSTRAINT [PK_DimLocation] PRIMARY KEY CLUSTERED
  (
    [LocationKey] ASC
  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

SET ARITHABORT ON
SET CONCAT_NULL_YIELDS_NULL ON
SET QUOTED_IDENTIFIER ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
SET NUMERIC_ROUNDABORT OFF
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UQ_DimLocation_NK'
    AND object_id = OBJECT_ID(N'[dbo].[DimLocation]')
)
  CREATE UNIQUE NONCLUSTERED INDEX [UQ_DimLocation_NK] ON [dbo].[DimLocation]
  (
    [PlaceType] ASC,
    [StateCode] ASC,
    [CityIBGECode_NK] ASC,
    [CityName_NK] ASC
  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO


-- =========================
-- FactCovid
-- =========================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[FactCovid]', N'U') IS NULL
BEGIN
  CREATE TABLE [dbo].[FactCovid](
    [DateKey] [int] NOT NULL,
    [LocationKey] [int] NOT NULL,
    [Confirmed] [int] NULL,
    [ConfirmedPer100kInhabitants] [float] NULL,
    [Deaths] [int] NULL,
    [DeathRate] [float] NULL,
    [IsLast] [bit] NULL,
    [OrderForPlace] [int] NULL,
    [LoadDttm] [date] NULL,
    [id] [bigint] IDENTITY(1,1) NOT NULL
  ) ON [PRIMARY]
END
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.key_constraints kc
  WHERE kc.[type] = 'PK'
    AND kc.parent_object_id = OBJECT_ID(N'[dbo].[FactCovid]')
)
  ALTER TABLE [dbo].[FactCovid] ADD  CONSTRAINT [PK_FactCovid] PRIMARY KEY CLUSTERED
  (
    [id] ASC
  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

IF OBJECT_ID(N'[dbo].[UQ_FactCovid_Grain]', N'UQ') IS NULL
  ALTER TABLE [dbo].[FactCovid] ADD  CONSTRAINT [UQ_FactCovid_Grain] UNIQUE NONCLUSTERED
  (
    [DateKey] ASC,
    [LocationKey] ASC
  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'IX_FactCovid_LocationDate'
    AND object_id = OBJECT_ID(N'[dbo].[FactCovid]')
)
  CREATE NONCLUSTERED INDEX [IX_FactCovid_LocationDate] ON [dbo].[FactCovid]
  (
    [LocationKey] ASC,
    [DateKey] ASC
  )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.foreign_keys
  WHERE name = N'FK_FactCovid_DimDate'
    AND parent_object_id = OBJECT_ID(N'[dbo].[FactCovid]')
)
BEGIN
  ALTER TABLE [dbo].[FactCovid] WITH CHECK ADD CONSTRAINT [FK_FactCovid_DimDate] FOREIGN KEY([DateKey])
  REFERENCES [dbo].[DimDate] ([DateKey])
  ALTER TABLE [dbo].[FactCovid] CHECK CONSTRAINT [FK_FactCovid_DimDate]
END
GO

IF NOT EXISTS (
  SELECT 1
  FROM sys.foreign_keys
  WHERE name = N'FK_FactCovid_DimLocation'
    AND parent_object_id = OBJECT_ID(N'[dbo].[FactCovid]')
)
BEGIN
  ALTER TABLE [dbo].[FactCovid] WITH CHECK ADD CONSTRAINT [FK_FactCovid_DimLocation] FOREIGN KEY([LocationKey])
  REFERENCES [dbo].[DimLocation] ([LocationKey])
  ALTER TABLE [dbo].[FactCovid] CHECK CONSTRAINT [FK_FactCovid_DimLocation]
END
GO


-- =========================
-- Funções (Inline TVF)
-- =========================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[fn_CovidEvolution_UntilDate]', N'IF') IS NULL
  EXEC(N'CREATE FUNCTION [dbo].[fn_CovidEvolution_UntilDate] (@DataFinal DATE)
  RETURNS TABLE
  AS
  RETURN
  (
    SELECT
      CAST(NULL AS date) AS [Date],
      CAST(NULL AS char(2)) AS StateCode,
      CAST(NULL AS nvarchar(150)) AS CityName,
      CAST(NULL AS int) AS Confirmed,
      CAST(NULL AS int) AS Deaths
    WHERE 1 = 0
  );');
GO
ALTER FUNCTION [dbo].[fn_CovidEvolution_UntilDate]
(
  @DataFinal DATE
)
RETURNS TABLE
AS
RETURN
(
  SELECT
    d.[Date],
    l.StateCode,
    l.CityName,
    f.Confirmed,
    f.Deaths
  FROM dbo.FactCovid f
  JOIN dbo.DimDate d
    ON d.DateKey = f.DateKey
  JOIN dbo.DimLocation l
    ON l.LocationKey = f.LocationKey
  WHERE d.[Date] BETWEEN @DataFinal AND DATEADD(DAY, 7, @DataFinal)
    AND l.PlaceType = 'city'
);
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[fn_CovidTotals_ByDate]', N'IF') IS NULL
  EXEC(N'CREATE FUNCTION [dbo].[fn_CovidTotals_ByDate] (@Data DATE)
  RETURNS TABLE
  AS
  RETURN
  (
    SELECT
      CAST(NULL AS bigint) AS TotalCasos,
      CAST(NULL AS bigint) AS TotalObitos,
      CAST(NULL AS float) AS LetalidadePct
    WHERE 1 = 0
  );');
GO
ALTER FUNCTION [dbo].[fn_CovidTotals_ByDate]
(
  @Data DATE
)
RETURNS TABLE
AS
RETURN
(
  SELECT
    TotalCasos  = SUM(f.Confirmed),
    TotalObitos = SUM(f.Deaths),
    LetalidadePct = 100.0 * SUM(f.Deaths) / NULLIF(SUM(f.Confirmed), 0)
  FROM dbo.FactCovid f
  JOIN dbo.DimDate d
    ON d.DateKey = f.DateKey
  JOIN dbo.DimLocation l
    ON l.LocationKey = f.LocationKey
  WHERE d.[Date] = @Data
    AND l.PlaceType = 'city'
);
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[fn_FactCovid_ByDate]', N'IF') IS NULL
  EXEC(N'CREATE FUNCTION [dbo].[fn_FactCovid_ByDate] (@Data DATE)
  RETURNS TABLE
  AS
  RETURN
  (
    SELECT
      CAST(NULL AS int) AS DateKey,
      CAST(NULL AS date) AS [Date],
      CAST(NULL AS int) AS LocationKey,
      CAST(NULL AS varchar(20)) AS PlaceType,
      CAST(NULL AS char(2)) AS StateCode,
      CAST(NULL AS nvarchar(150)) AS CityName,
      CAST(NULL AS int) AS Confirmed,
      CAST(NULL AS int) AS Deaths,
      CAST(NULL AS bit) AS IsLast
    WHERE 1 = 0
  );');
GO
ALTER FUNCTION [dbo].[fn_FactCovid_ByDate]
(
  @Data DATE
)
RETURNS TABLE
AS
RETURN
(
  SELECT
    f.DateKey,
    d.[Date],
    l.LocationKey,
    l.PlaceType,
    l.StateCode,
    l.CityName,
    f.Confirmed,
    f.Deaths,
    f.IsLast
  FROM dbo.FactCovid f
  JOIN dbo.DimDate d
    ON d.DateKey = f.DateKey
  JOIN dbo.DimLocation l
    ON l.LocationKey = f.LocationKey
  WHERE d.[Date] = @Data
);
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[fn_TopDeathCity_ByDate]', N'IF') IS NULL
  EXEC(N'CREATE FUNCTION [dbo].[fn_TopDeathCity_ByDate] (@Data DATE)
  RETURNS TABLE
  AS
  RETURN
  (
    SELECT
      CAST(NULL AS char(2)) AS StateCode,
      CAST(NULL AS nvarchar(150)) AS CityName,
      CAST(NULL AS int) AS Deaths
    WHERE 1 = 0
  );');
GO
ALTER FUNCTION [dbo].[fn_TopDeathCity_ByDate]
(
  @Data DATE
)
RETURNS TABLE
AS
RETURN
(
  SELECT TOP (1)
    l.StateCode,
    l.CityName,
    f.Deaths
  FROM dbo.FactCovid f
  JOIN dbo.DimDate d
    ON d.DateKey = f.DateKey
  JOIN dbo.DimLocation l
    ON l.LocationKey = f.LocationKey
  WHERE d.[Date] = @Data
    AND l.PlaceType = 'city'
  ORDER BY f.Deaths DESC
);
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[usp_Clean_CovidDW]', N'P') IS NULL
	EXEC('CREATE PROCEDURE [dbo].[usp_Clean_CovidDW] AS BEGIN SET NOCOUNT ON; END');
GO
ALTER PROCEDURE [dbo].[usp_Clean_CovidDW]
AS
  SET NOCOUNT ON;

-- TRUNCATE TABLE dbo.DimDate;
-- TRUNCATE TABLE dbo.DimLocation;
TRUNCATE TABLE dbo.FactCovid;
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[usp_DimDate_Upsert]', N'P') IS NULL
	EXEC('CREATE PROCEDURE [dbo].[usp_DimDate_Upsert] AS BEGIN SET NOCOUNT ON; END');
GO
ALTER PROCEDURE [dbo].[usp_DimDate_Upsert]
AS
BEGIN
  SET NOCOUNT ON;

  ;WITH src AS (
    SELECT DISTINCT
      [date] = CAST([date] AS DATE)
    FROM dbo.arquivo
    WHERE [date] IS NOT NULL
  )
  MERGE dbo.DimDate AS tgt
  USING src
    ON tgt.[Date] = src.[date]
  WHEN NOT MATCHED THEN
    INSERT (DateKey, [Date], [Year], [Month], [Day], [Quarter], MonthName)
    VALUES (
      CONVERT(INT, FORMAT(src.[date], 'yyyyMMdd')),
      src.[date],
      DATEPART(YEAR, src.[date]),
      DATEPART(MONTH, src.[date]),
      DATEPART(DAY, src.[date]),
      DATEPART(QUARTER, src.[date]),
      DATENAME(MONTH, src.[date])
    );
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[usp_DimLocation_Upsert]', N'P') IS NULL
	EXEC('CREATE PROCEDURE [dbo].[usp_DimLocation_Upsert] AS BEGIN SET NOCOUNT ON; END');
GO
ALTER PROCEDURE [dbo].[usp_DimLocation_Upsert]
AS
BEGIN
  SET NOCOUNT ON;

  ;WITH src AS (
    SELECT DISTINCT
      PlaceType               = LTRIM(RTRIM(CAST(place_type AS VARCHAR(20)))),
      StateCode               = UPPER(LTRIM(RTRIM(CAST([state] AS CHAR(2))))),
      CityName                = NULLIF(LTRIM(RTRIM(CAST(city AS NVARCHAR(150)))), N''),
      CityIBGECode            = TRY_CONVERT(INT, city_ibge_code),
      EstimatedPopulation     = TRY_CONVERT(INT, estimated_population),
      EstimatedPopulation2019 = TRY_CONVERT(INT, estimated_population_2019)
    FROM dbo.arquivo
    WHERE [state] IS NOT NULL
      AND place_type IS NOT NULL
  )
  MERGE dbo.DimLocation AS tgt
  USING src
    ON  tgt.PlaceType = src.PlaceType
    AND tgt.StateCode = src.StateCode
    AND ISNULL(tgt.CityIBGECode,-1) = ISNULL(src.CityIBGECode,-1)
    AND ISNULL(tgt.CityName,N'')    = ISNULL(src.CityName,N'')
  WHEN MATCHED THEN
    UPDATE SET
      tgt.EstimatedPopulation     = COALESCE(src.EstimatedPopulation, tgt.EstimatedPopulation),
      tgt.EstimatedPopulation2019 = COALESCE(src.EstimatedPopulation2019, tgt.EstimatedPopulation2019)
  WHEN NOT MATCHED THEN
    INSERT (PlaceType, StateCode, CityName, CityIBGECode, EstimatedPopulation, EstimatedPopulation2019)
    VALUES (src.PlaceType, src.StateCode, src.CityName, src.CityIBGECode, src.EstimatedPopulation, src.EstimatedPopulation2019);
END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[usp_FactCovid_Upsert]', N'P') IS NULL
	EXEC('CREATE PROCEDURE [dbo].[usp_FactCovid_Upsert] AS BEGIN SET NOCOUNT ON; END');
GO
ALTER PROCEDURE [dbo].[usp_FactCovid_Upsert]
AS
BEGIN
  SET NOCOUNT ON;

  -- Garante dims antes
  EXEC dbo.usp_DimDate_Upsert;
  EXEC dbo.usp_DimLocation_Upsert;

  ;WITH src AS (
    SELECT
      DateKey = CONVERT(INT, FORMAT(CAST(r.[date] AS DATE), 'yyyyMMdd')),
      rdate   = CAST(r.[date] AS DATE),

      PlaceType = LTRIM(RTRIM(CAST(r.place_type AS VARCHAR(20)))),
      StateCode = UPPER(LTRIM(RTRIM(CAST(r.[state] AS CHAR(2))))),
      CityName  = NULLIF(LTRIM(RTRIM(CAST(r.city AS NVARCHAR(150)))), N''),
      CityIBGECode = TRY_CONVERT(INT, r.city_ibge_code),

      Confirmed                   = TRY_CONVERT(INT, r.confirmed),
      ConfirmedPer100kInhabitants = TRY_CONVERT(DECIMAL(18,5), r.confirmed_per_100k_inhabitants),
      Deaths                      = TRY_CONVERT(INT, r.deaths),
      DeathRate                   = TRY_CONVERT(DECIMAL(18,6), r.death_rate),

      IsLast        = TRY_CONVERT(BIT, r.is_last),
      OrderForPlace = TRY_CONVERT(INT, r.order_for_place)
    FROM dbo.arquivo r
    WHERE r.[date] IS NOT NULL
      AND r.[state] IS NOT NULL
      AND r.place_type IS NOT NULL
  ),
  mapped AS (
    SELECT
      s.DateKey,
      l.LocationKey,
      s.Confirmed,
      s.ConfirmedPer100kInhabitants,
      s.Deaths,
      s.DeathRate,
      s.IsLast,
      s.OrderForPlace,
      ROW_NUMBER() OVER (PARTITION BY s.DateKey, l.Locationkey ORDER BY ISNULL(s.IsLast,0) desc, ISNULL(s.OrderForPlace, -1) desc) rn
    FROM src s 
    INNER JOIN dbo.DimLocation l
      ON  l.PlaceType = s.PlaceType
      AND l.StateCode = s.StateCode
      AND ISNULL(l.CityIBGECode,-1) = ISNULL(s.CityIBGECode,-1)
      AND ISNULL(l.CityName,N'')    = ISNULL(s.CityName,N'')
  ),
  filtrados AS(
   SELECT * FROM mapped WHERE rn=1
  )

  MERGE dbo.FactCovid AS tgt
  USING filtrados AS m 
    ON tgt.DateKey = m.DateKey
   AND tgt.LocationKey = m.LocationKey
  WHEN MATCHED THEN
    UPDATE SET
      tgt.Confirmed                   = m.Confirmed,
      tgt.ConfirmedPer100kInhabitants = m.ConfirmedPer100kInhabitants,
      tgt.Deaths                      = m.Deaths,
      tgt.DeathRate                   = m.DeathRate,
      tgt.IsLast                      = m.IsLast,
      tgt.OrderForPlace               = m.OrderForPlace,
      tgt.LoadDttm                    = SYSDATETIME()
  WHEN NOT MATCHED THEN
    INSERT (DateKey, LocationKey, Confirmed, ConfirmedPer100kInhabitants, Deaths, DeathRate, IsLast, OrderForPlace)
    VALUES (m.DateKey, m.LocationKey, m.Confirmed, m.ConfirmedPer100kInhabitants, m.Deaths, m.DeathRate, m.IsLast, m.OrderForPlace);
END
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID(N'[dbo].[usp_Load_CovidDW]', N'P') IS NULL
	EXEC('CREATE PROCEDURE [dbo].[usp_Load_CovidDW] AS BEGIN SET NOCOUNT ON; END');
GO
ALTER PROCEDURE [dbo].[usp_Load_CovidDW]
AS
BEGIN
  SET NOCOUNT ON;

  EXEC dbo.usp_DimDate_Upsert;
  EXEC dbo.usp_DimLocation_Upsert;
  EXEC dbo.usp_FactCovid_Upsert;
END
GO


-- =========================
-- Tabelas auxiliares (auth + stage ETL)
-- =========================
IF OBJECT_ID(N'[dbo].[usuarios]', N'U') IS NULL
BEGIN
  CREATE TABLE [dbo].[usuarios](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [username] [nvarchar](50) NOT NULL,
    [email] [nvarchar](255) NOT NULL,
    [senha] [nvarchar](100) NOT NULL,
    [refresh_token] [nvarchar](4000) NULL,
    [role] [nvarchar](20) NOT NULL
  ) ON [PRIMARY]

  ALTER TABLE [dbo].[usuarios] ADD CONSTRAINT [PK_usuarios] PRIMARY KEY CLUSTERED ([id] ASC);
  ALTER TABLE [dbo].[usuarios] ADD CONSTRAINT [UQ_usuarios_username] UNIQUE NONCLUSTERED ([username] ASC);
  ALTER TABLE [dbo].[usuarios] ADD CONSTRAINT [UQ_usuarios_email] UNIQUE NONCLUSTERED ([email] ASC);
END
GO

IF OBJECT_ID(N'[dbo].[arquivo]', N'U') IS NULL
BEGIN
  CREATE TABLE [dbo].[arquivo](
    [id] [bigint] IDENTITY(1,1) NOT NULL,
    [date] [nvarchar](255) NULL,
    [state] [nvarchar](255) NULL,
    [city] [nvarchar](255) NULL,
    [place_type] [nvarchar](255) NULL,
    [confirmed] [nvarchar](255) NULL,
    [deaths] [nvarchar](255) NULL,
    [order_for_place] [nvarchar](255) NULL,
    [is_last] [nvarchar](255) NULL,
    [estimated_population_2019] [nvarchar](255) NULL,
    [estimated_population] [nvarchar](255) NULL,
    [city_ibge_code] [nvarchar](255) NULL,
    [confirmed_per_100k_inhabitants] [nvarchar](255) NULL,
    [death_rate] [nvarchar](255) NULL
  ) ON [PRIMARY]

  ALTER TABLE [dbo].[arquivo] ADD CONSTRAINT [PK_arquivo] PRIMARY KEY CLUSTERED ([id] ASC);
END
GO
