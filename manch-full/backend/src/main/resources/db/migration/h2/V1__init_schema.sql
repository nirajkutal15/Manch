-- V1__init_schema.sql (H2)
CREATE TABLE users (
    id VARCHAR(36) NOT NULL DEFAULT RANDOM_UUID(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
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
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE gigs (
    id VARCHAR(36) NOT NULL DEFAULT RANDOM_UUID(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    posted_by_id VARCHAR(36) NOT NULL,
    city VARCHAR(100) NOT NULL,
    venue VARCHAR(200),
    address TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    gig_type VARCHAR(50) NOT NULL,
    pay_type VARCHAR(20) NOT NULL,
    pay_amount INT,
    slots_available INT NOT NULL DEFAULT 1,
    slots_filled INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    requirements TEXT,
    duration_minutes INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_gigs_user FOREIGN KEY (posted_by_id) REFERENCES users(id)
);

CREATE TABLE gig_art_forms (
    gig_id VARCHAR(36) NOT NULL,
    art_form VARCHAR(50) NOT NULL,
    PRIMARY KEY (gig_id, art_form),
    CONSTRAINT fk_gaf FOREIGN KEY (gig_id) REFERENCES gigs(id) ON DELETE CASCADE
);

CREATE TABLE applications (
    id VARCHAR(36) NOT NULL DEFAULT RANDOM_UUID(),
    gig_id VARCHAR(36) NOT NULL,
    artist_id VARCHAR(36) NOT NULL,
    note TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    venue_note TEXT,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_application UNIQUE (gig_id, artist_id),
    CONSTRAINT fk_app_gig FOREIGN KEY (gig_id) REFERENCES gigs(id),
    CONSTRAINT fk_app_artist FOREIGN KEY (artist_id) REFERENCES users(id)
);

CREATE TABLE reviews (
    id VARCHAR(36) NOT NULL DEFAULT RANDOM_UUID(),
    reviewer_id VARCHAR(36) NOT NULL,
    reviewee_id VARCHAR(36) NOT NULL,
    gig_id VARCHAR(36) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    review_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_review UNIQUE (reviewer_id, reviewee_id, gig_id),
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id),
    CONSTRAINT fk_review_gig FOREIGN KEY (gig_id) REFERENCES gigs(id)
);

CREATE TABLE waitlist_entries (
    id VARCHAR(36) NOT NULL DEFAULT RANDOM_UUID(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL,
    art_form VARCHAR(50),
    bio TEXT,
    venue_name VARCHAR(200),
    venue_type VARCHAR(50),
    phone VARCHAR(20),
    notified BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_waitlist_email UNIQUE (email)
);

CREATE TABLE contact_messages (
    id VARCHAR(36) NOT NULL DEFAULT RANDOM_UUID(),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE INDEX idx_gigs_city_status ON gigs(city, status);
CREATE INDEX idx_gigs_date ON gigs(event_date);
CREATE INDEX idx_apps_artist ON applications(artist_id);
CREATE INDEX idx_apps_gig ON applications(gig_id);
