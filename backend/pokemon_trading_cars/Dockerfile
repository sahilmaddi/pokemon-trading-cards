# 1) Build stage: use Maven to build the Spring Boot jar
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /build

COPY pom.xml mvnw ./
COPY .mvn/ .mvn/
COPY src/ src/

RUN ls -la /build
RUN ls -la /build/src
RUN cat /build/pom.xml

RUN mvn -B -DskipTests package

# 2) Runtime stage: small JRE image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

ENV PORT=8086
EXPOSE 8086

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8086}"]
