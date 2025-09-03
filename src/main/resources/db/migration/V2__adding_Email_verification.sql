-- Remove old is_verified column
ALTER TABLE Users
DROP COLUMN is_verified;

-- Add new email_verified column
ALTER TABLE Users
    ADD COLUMN email_verified BOOLEAN NOT NULL DEFAULT FALSE AFTER longitude;

-- this table has been drop due to some changes has been made
CREATE TABLE email_verification_tokens (
    token_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(255) NOT NULL,
    OTP        VARCHAR(6) NOT NULL,
    expiry_time  TIMESTAMP NOT NULL,
    is_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES Users(email) ON DELETE CASCADE
);
