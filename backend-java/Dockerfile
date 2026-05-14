FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline --no-transfer-progress -q
COPY src ./src
RUN mvn package -DskipTests --no-transfer-progress -q

FROM eclipse-temurin:21-jre-alpine AS runner
WORKDIR /app
RUN addgroup -S easylearn && adduser -S easylearn -G easylearn
COPY --from=builder /app/target/*.jar app.jar
USER easylearn
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
