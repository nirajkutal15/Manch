-- V1__init_schema.sql (MySQL)
CREATE TABLE users (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ARTIST','VENUE','ADMIN') NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email_verified TINYINT(1) NOT NULL DEFAULT 0,
    active TINYINT(1) NOT NULL DEFAULT 1,
    art_form VARCHAR(50),
    bio TEXT,
    profile_image_url TEXT,
    sample_clip_url TEXT,
    years_experience INT DEFAULT 0,
    rating DOUBLE DEFAULT 0.0,
    total_shows INT DEFAULT 0,
    venue_name VARCHAR(200),
    venue_type VARCHAR(50),
    website_url TEXT,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE gigs (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    posted_by_id VARCHAR(36) NOT NULL,
    city VARCHAR(100) NOT NULL,
    venue VARCHAR(200),
    address TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    gig_type VARCHAR(50) NOT NULL,
    pay_type ENUM('FREE','PAID','NEGOTIABLE') NOT NULL,
    pay_amount INT,
    slots_available INT NOT NULL DEFAULT 1,
    slots_filled INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    requirements TEXT,
    duration_minutes INT,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_gigs_user FOREIGN KEY (posted_by_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE gig_art_forms (
    gig_id VARCHAR(36) NOT NULL,
    art_form VARCHAR(50) NOT NULL,
    PRIMARY KEY (gig_id, art_form),
    CONSTRAINT fk_gaf FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE applications (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    gig_id VARCHAR(36) NOT NULL,
    artist_id VARCHAR(36) NOT NULL,
    note TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    venue_note TEXT,
    applied_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    reviewed_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_application (gig_id, artist_id),
    CONSTRAINT fk_app_gig FOREIGN KEY (gig_id) REFERENCES gigs(id),
    CONSTRAINT fk_app_artist FOREIGN KEY (artist_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reviews (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    reviewer_id VARCHAR(36) NOT NULL,
    reviewee_id VARCHAR(36) NOT NULL,
    gig_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    review_type VARCHAR(20) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_review (reviewer_id, reviewee_id, gig_id),
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id),
    CONSTRAINT fk_review_gig FOREIGN KEY (gig_id) REFERENCES gigs(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE waitlist_entries (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    type ENUM('ARTIST','VENUE') NOT NULL,
    art_form VARCHAR(50),
    bio TEXT,
    venue_name VARCHAR(200),
    venue_type VARCHAR(50),
    phone VARCHAR(20),
    notified TINYINT(1) NOT NULL DEFAULT 0,
    joined_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_waitlist_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_messages (
    id VARCHAR(36) NOT NULL DEFAULT (UUID()),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_gigs_city_status ON gigs(city, status);
CREATE INDEX idx_gigs_date ON gigs(event_date);
CREATE INDEX idx_apps_artist ON applications(artist_id);
CREATE INDEX idx_apps_gig ON applications(gig_id);
