FROM openjdk:21

WORKDIR /app

COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src src
RUN ./mvnw clean package -DskipTests && mv target/*.jar target/app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/app.jar"]