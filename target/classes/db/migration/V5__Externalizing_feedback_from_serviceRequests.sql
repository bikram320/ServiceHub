
-- alter table service_requests
    -- drop column rating;

-- alter table service_requests
    -- drop column feedback;

CREATE TABLE feedback (
    feedback_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id    BIGINT UNIQUE,   -- one feedback per request
    rating        FLOAT CHECK (rating BETWEEN 1 AND 5),
    comments      TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES service_requests(request_id)
);