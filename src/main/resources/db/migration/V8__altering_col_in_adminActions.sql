-- Change action_type to ENUM (Status)
ALTER TABLE admin_actions
    MODIFY COLUMN action_type ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL;

-- Change target_type to ENUM (Role)
ALTER TABLE admin_actions
    MODIFY COLUMN target_type ENUM('ADMIN', 'TECHNICIAN', 'USER') NULL;
