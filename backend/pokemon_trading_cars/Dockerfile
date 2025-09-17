# 1) Build stage: use Maven to build the Spring Boot jar
FROM maven:3.9.4-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy the project files relative to the build context (pokemon_trading_cars)
COPY pom.xml mvnw ./
COPY .mvn/ .mvn/
COPY src/ src/

# Verify files copied correctly
RUN ls -la /build
RUN ls -la /build/src
RUN cat /build/pom.xml

# Run Maven build to package application skipping tests
RUN mvn -B -DskipTests package


# Copy the jar produced by the builder stage
COPY --from=builder /build/pokemon_trading_cars/target/*.jar app.jar

# Let Render (and other platforms) control the port via the PORT env var.
# Default to 8086 if PORT is not provided.
ENV PORT=8086
EXPOSE 8086

# Use shell form so ${PORT} is expanded from environment at runtime
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8086}"]
