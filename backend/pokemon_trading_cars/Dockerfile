# 1) Build stage: use Maven to build the Spring Boot jar
FROM maven:3.9.4-eclipse-temurin-17 AS builder

# Set working directory inside the image
WORKDIR /build

# Copy the entire project folder into the image at /build/pokemon_trading_cars
COPY pokemon_trading_cars ./pokemon_trading_cars

# Switch to the project folder
WORKDIR /build/pokemon_trading_cars

# Build the project skipping tests to save build time
RUN mvn -B -DskipTests package

# 2) Runtime stage: small JRE image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the jar produced by the builder stage
COPY --from=builder /build/pokemon_trading_cars/target/*.jar app.jar

# Let Render (and other platforms) control the port via the PORT env var.
# Default to 8086 if PORT is not provided.
ENV PORT=8086
EXPOSE 8086

# Use shell form so ${PORT} is expanded from environment at runtime
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8086}"]
