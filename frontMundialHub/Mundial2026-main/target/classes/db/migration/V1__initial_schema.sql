CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(30) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('AFICIONADO','OPERATOR','ADMIN','COMPLIANCE','SUPPORT') DEFAULT 'AFICIONADO',
    status ENUM('ACTIVE','PENDING_VERIFICATION','SUSPENDED','BLOCKED') DEFAULT 'PENDING_VERIFICATION',
    email_verified BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    locked_until DATETIME NULL,
    last_login_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    favorite_teams TEXT,
    favorite_cities TEXT,
    favorite_stadiums TEXT,
    notification_channel ENUM('EMAIL','PUSH','BOTH') DEFAULT 'EMAIL',
    timezone VARCHAR(50) DEFAULT 'UTC',
    match_reminders_enabled BOOLEAN DEFAULT TRUE,
    reminder_minutes_before INT DEFAULT 60,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS matches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(100) UNIQUE,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    stadium VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    match_date DATETIME NOT NULL,
    phase ENUM('GROUP_STAGE','ROUND_OF_32','ROUND_OF_16','QUARTER_FINALS','SEMI_FINALS','THIRD_PLACE','FINAL'),
    status ENUM('SCHEDULED','IN_PROGRESS','FINISHED','POSTPONED','CANCELLED') DEFAULT 'SCHEDULED',
    home_score INT NULL,
    away_score INT NULL,
    available_tickets INT DEFAULT 0,
    total_capacity INT DEFAULT 0,
    data_confirmed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    correlation_id VARCHAR(36) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    match_id BIGINT NOT NULL,
    status ENUM('AVAILABLE','RESERVED','PAID','TRANSFERRED','REFUNDED','EXPIRED') DEFAULT 'AVAILABLE',
    section VARCHAR(50),
    seat_number VARCHAR(20),
    price DECIMAL(10,2),
    reservation_expires_at DATETIME NULL,
    payment_transaction_id VARCHAR(100) NULL,
    transferred_to_user_id BIGINT NULL,
    transferred_at DATETIME NULL,
    refund_reason TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS pollas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by_user_id BIGINT NOT NULL,
    invite_code VARCHAR(8) NOT NULL UNIQUE,
    status ENUM('ACTIVE','FINISHED','CANCELLED') DEFAULT 'ACTIVE',
    points_winner INT DEFAULT 3,
    points_exact_score INT DEFAULT 5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS polla_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    polla_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    total_points INT DEFAULT 0,
    `rank` INT DEFAULT 0,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_member (polla_id, user_id),
    FOREIGN KEY (polla_id) REFERENCES pollas(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS pronosticos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    polla_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    match_id BIGINT NOT NULL,
    predicted_home_score INT NOT NULL,
    predicted_away_score INT NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    points_earned INT DEFAULT 0,
    calculated BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_pronostico (polla_id, user_id, match_id),
    FOREIGN KEY (polla_id) REFERENCES pollas(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id)
);

CREATE TABLE IF NOT EXISTS stickers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    team VARCHAR(100),
    category ENUM('PLAYER','STADIUM','TEAM_BADGE','GOLDEN_SPECIAL'),
    rarity ENUM('COMMON','UNCOMMON','RARE','LEGENDARY'),
    image_url VARCHAR(255),
    description TEXT,
    page_number INT DEFAULT 1
);

CREATE TABLE IF NOT EXISTS user_stickers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sticker_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    is_pasted BOOLEAN DEFAULT FALSE,
    obtained_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_sticker (user_id, sticker_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (sticker_id) REFERENCES stickers(id)
);

CREATE TABLE IF NOT EXISTS sticker_trades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    offered_sticker_id BIGINT NOT NULL,
    requested_sticker_id BIGINT NOT NULL,
    status ENUM('PENDING','ACCEPTED','REJECTED','CANCELLED','EXPIRED') DEFAULT 'PENDING',
    correlation_id VARCHAR(36) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
);

INSERT INTO matches (external_id, home_team, away_team, stadium, city, country, match_date, phase, status, available_tickets, total_capacity, data_confirmed) VALUES
('WC2026-001', 'México', 'Polonia', 'Estadio Azteca', 'Ciudad de México', 'México', '2026-06-11 18:00:00', 'GROUP_STAGE', 'SCHEDULED', 8000, 87000, true),
('WC2026-002', 'Argentina', 'Arabia Saudita', 'AT&T Stadium', 'Dallas', 'USA', '2026-06-12 20:00:00', 'GROUP_STAGE', 'SCHEDULED', 5000, 80000, true),
('WC2026-003', 'Brasil', 'Serbia', 'SoFi Stadium', 'Los Angeles', 'USA', '2026-06-13 17:00:00', 'GROUP_STAGE', 'SCHEDULED', 6000, 70000, true),
('WC2026-004', 'Colombia', 'Rumania', 'Estadio Metropolitano', 'Barranquilla', 'Colombia', '2026-06-14 15:00:00', 'GROUP_STAGE', 'SCHEDULED', 7000, 50000, true),
('WC2026-005', 'España', 'Croacia', 'BC Place', 'Vancouver', 'Canadá', '2026-06-15 19:00:00', 'GROUP_STAGE', 'SCHEDULED', 4000, 55000, true);

INSERT INTO stickers (code, name, team, category, rarity, image_url, page_number) VALUES
('ARG-001', 'Escudo Argentina', 'Argentina', 'TEAM_BADGE', 'COMMON', '/avatars/arg-badge.svg', 1),
('ARG-002', 'Jugador Estrella Argentina', 'Argentina', 'PLAYER', 'RARE', '/avatars/arg-player1.svg', 1),
('BRA-001', 'Escudo Brasil', 'Brasil', 'TEAM_BADGE', 'COMMON', '/avatars/bra-badge.svg', 2),
('COL-001', 'Escudo Colombia', 'Colombia', 'TEAM_BADGE', 'COMMON', '/avatars/col-badge.svg', 3),
('ESP-001', 'Escudo España', 'España', 'TEAM_BADGE', 'COMMON', '/avatars/esp-badge.svg', 4),
('MEX-001', 'Escudo México', 'México', 'TEAM_BADGE', 'COMMON', '/avatars/mex-badge.svg', 5),
('GOLD-001', 'Trofeo Mundial', NULL, 'GOLDEN_SPECIAL', 'LEGENDARY', '/avatars/trophy.svg', 20);