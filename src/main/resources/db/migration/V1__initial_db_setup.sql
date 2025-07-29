-- USERS TABLE
CREATE TABLE Users (
    user_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    phone        VARCHAR(15)  NOT NULL,
    address      VARCHAR(255),
    latitude     DECIMAL(10, 6),
    longitude    DECIMAL(10, 6),
    is_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    status       ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING', -- Admin approval
    role         VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Technicians (
    tech_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    phone        VARCHAR(15)  NOT NULL,
    address      VARCHAR(255),
    latitude     DECIMAL(10, 6),
    longitude    DECIMAL(10, 6),
    status       ENUM('PENDING', 'APPROVED', 'REJECTED', 'BLOCKED') NOT NULL,
    is_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    available    BOOLEAN NOT NULL DEFAULT FALSE,
    role         VARCHAR(50) NOT NULL DEFAULT 'TECHNICIAN',
    rating       FLOAT CHECK (rating BETWEEN 1 AND 5),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SKILLS TABLE
CREATE TABLE Skills (
    skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) UNIQUE NOT NULL
);

-- TECHNICIAN-SKILLS with INDIVIDUAL FEE
CREATE TABLE TechnicianSkills (
    tech_id   BIGINT NOT NULL,
    skill_id  BIGINT NOT NULL,
    fee       DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (tech_id, skill_id),
    FOREIGN KEY (tech_id) REFERENCES Technicians(tech_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id) ON DELETE CASCADE
);

-- ADMINS
CREATE TABLE Admins (
    admin_id   BIGINT PRIMARY KEY DEFAULT 1,
    name       VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(50) NOT NULL DEFAULT 'ADMIN'
);

-- ADMIN ACTIONS
CREATE TABLE AdminActions (
    action_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id      BIGINT NOT NULL,
    action_type   VARCHAR(100) NOT NULL,
    target_type   ENUM('USER', 'TECHNICIAN') DEFAULT NULL,
    target_id     BIGINT,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id)
);

-- SERVICE REQUESTS
CREATE TABLE ServiceRequests (
    request_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL,
    tech_id          BIGINT NOT NULL,
    skill_id         BIGINT NOT NULL,
    description      TEXT,
    appointment_time DATETIME NOT NULL,
    status           ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    fee_charged      DECIMAL(10, 2) NOT NULL,
    rating           FLOAT CHECK (rating BETWEEN 1 AND 5),
    feedback         TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (tech_id) REFERENCES Technicians(tech_id),
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
);

-- PAYMENT TABLE (Only eSewa based)
CREATE TABLE Payments (
    payment_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id     BIGINT NOT NULL UNIQUE,
    user_id        BIGINT NOT NULL,
    tech_id        BIGINT NOT NULL,
    amount         DECIMAL(10, 2) NOT NULL,
    transaction_id VARCHAR(100),
    status         ENUM('PENDING', 'PAID', 'FAILED') NOT NULL DEFAULT 'PENDING',
    paid_at        TIMESTAMP NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES ServiceRequests(request_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (tech_id) REFERENCES Technicians(tech_id)
);
