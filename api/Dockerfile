# build

FROM maven:3.9.6-eclipse-temurin-21 as build

WORKDIR /build

COPY . .

RUN mvn clean package -DskipTests


#run
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build ./build/target/*jar ./api.jar

EXPOSE 8080

ENV PORT=8080
ENV DATABASE_URL=jdbc:sqlserver://localhost:1433;databaseName=etljava2;encrypt=false;trustServerCertificate=true;createDatabaseIfNotExist=true
ENV DATABASE_USERNAME=sa
ENV DATABASE_PASSWORD=Entrar123*
ENV TZ=America/Sao_Paulo

ENTRYPOINT ["java", "-jar", "api.jar"]