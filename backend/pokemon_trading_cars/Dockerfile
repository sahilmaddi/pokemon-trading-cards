FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /build

# Copy the entire subfolder, not just root files
COPY pom.xml mvnw ./
COPY .mvn/ .mvn/
COPY src/ src/


WORKDIR /build/pokemon_trading_cars
RUN mvn -B -DskipTests package
RUN ls -l target  # Debug: list built jars

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Use the exact subpath for the jar(s)
COPY --from=builder /build/pokemon_trading_cars/target/*.jar app.jar

ENV PORT=8086
EXPOSE 8086

ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8086}"]
