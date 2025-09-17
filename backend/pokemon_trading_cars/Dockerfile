# 1) Build stage: use Maven to build the Spring Boot jar
<<<<<<< HEAD
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

=======
FROM maven:3.9.4-eclipse-temurin-21 AS builder

# Set working directory inside the image
WORKDIR /build

# Copy the entire project folder into the image at /build/pokemon_trading_cars
COPY pokemon_trading_cars ./pokemon_trading_cars

# Switch to the project folder
WORKDIR /build/pokemon_trading_cars

# Build the project skipping tests to save build time
RUN mvn -B -DskipTests package

>>>>>>> 19f3921b0f15634ec03459e178fbc8377ebaf35e
# 2) Runtime stage: small JRE image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

<<<<<<< HEAD
# Copy the jar produced in the build stage
COPY --from=builder /build/target/*.jar app.jar
=======
# Copy the jar produced by the builder stage
COPY --from=builder /build/pokemon_trading_cars/target/*.jar app.jar
>>>>>>> 19f3921b0f15634ec03459e178fbc8377ebaf35e

# Let Render (and other platforms) control the port via the PORT env var.
# Default to 8086 if PORT is not provided.
ENV PORT=8086
EXPOSE 8086

# Use shell form so ${PORT} is expanded from environment at runtime
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8086}"]
