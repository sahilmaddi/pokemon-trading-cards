# Use Eclipse Temurin base image for Java 17
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Copy the built jar file (adjust the path if needed)
COPY target/*.jar app.jar

# Expose port (adjust if your app uses a different port)
EXPOSE 8086

# Run the Spring Boot app on port 8086
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=8086"]
