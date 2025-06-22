CREATE TABLE Users (
    user_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255),
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(255) NOT NULL,
    address    VARCHAR(255) NOT NULL,
    role       VARCHAR(50)  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Technicians (
    tech_id     INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(255) NOT NULL,
    skills      VARCHAR(255) NOT NULL,
    status      VARCHAR(50)  NOT NULL,
    role        VARCHAR(50)  NOT NULL DEFAULT 'TECHNICIAN',
    rating      FLOAT CHECK (rating BETWEEN 1 AND 5),
    available   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ServiceRequests (
    request_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL,
    tech_id          INT NOT NULL,
    service_type     VARCHAR(255) NOT NULL,
    description      TEXT,
    appointment_time DATETIME NOT NULL,
    status           VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    rating           FLOAT CHECK (rating BETWEEN 1 AND 5),
    feedback         TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT fk_technician FOREIGN KEY (tech_id) REFERENCES Technicians(tech_id)
);