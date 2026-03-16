-- V2__seed_data.sql (H2)
-- password for all: Test@1234 (bcrypt)
-- admin password: Admin@1234

INSERT INTO users (id,email,password_hash,full_name,role,city,email_verified,art_form,bio,years_experience,rating,total_shows) VALUES
('artist-001','priya@example.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Priya Sharma','ARTIST','Pune',TRUE,'SPOKEN_WORD','Spoken word artist from Pune. I blend poetry and storytelling to explore identity and everyday Indian life.',2,4.9,8),
('artist-002','arjun@example.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Arjun Mehta','ARTIST','Mumbai',TRUE,'STANDUP_COMEDY','5 years on the stand-up circuit. From college fests to corporate gigs, I bring sharp observational humour.',5,4.7,40),
('artist-003','kavya@example.com','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Kavya Nair','ARTIST','Bangalore',TRUE,'POETRY','Poet and spoken word performer. My work draws from Kerala folklore and urban Bangalore life.',3,4.8,15);

INSERT INTO users (id,email,password_hash,full_name,role,city,email_verified,venue_name,venue_type) VALUES
('venue-001','cafe@bohemian.in','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Cafe Bohemian','VENUE','Mumbai',TRUE,'Cafe Bohemian','CAFE_RESTAURANT'),
('venue-002','iitb@fest.in','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','IIT Bombay Mood Indigo','VENUE','Mumbai',TRUE,'IIT Bombay Fest','COLLEGE_UNIVERSITY'),
('venue-003','theink@space.in','$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','The Ink Space','VENUE','Pune',TRUE,'The Ink Space','COMMUNITY_SPACE');

INSERT INTO users (id,email,password_hash,full_name,role,city,email_verified) VALUES
('admin-001','admin@manch.in','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LwQ5WMzVBYfHhK5Ky','Manch Admin','ADMIN','Pune',TRUE);

INSERT INTO gigs (id,title,description,posted_by_id,city,venue,event_date,event_time,gig_type,pay_type,pay_amount,slots_available,slots_filled,status) VALUES
('gig-001','Thursday Open Mic','Weekly open mic at Cafe Bohemian. 5-minute slots. All art forms welcome.','venue-001','Mumbai','Cafe Bohemian, Bandra',DATEADD('DAY',5,CURRENT_DATE),'19:30:00','OPEN_MIC','FREE',NULL,4,1,'OPEN'),
('gig-002','Spoken Word Night','Curated evening of poetry and spoken word. 10-minute sets.','venue-001','Mumbai','Cafe Bohemian',DATEADD('DAY',12,CURRENT_DATE),'20:00:00','CULTURAL_EVENT','PAID',1500,2,0,'OPEN'),
('gig-003','Mood Indigo 2025 — Comedy Stage','Annual cultural fest at IIT Bombay. Looking for stand-up comedians.','venue-002','Mumbai','IIT Bombay Main Stage',DATEADD('DAY',30,CURRENT_DATE),'18:00:00','COLLEGE_FEST','PAID',5000,3,1,'OPEN'),
('gig-004','Sunday Stories — Storytelling Open Mic','Relaxed Sunday storytelling session at The Ink Space.','venue-003','Pune','The Ink Space, Koregaon Park',DATEADD('DAY',7,CURRENT_DATE),'11:00:00','OPEN_MIC','FREE',NULL,6,2,'OPEN'),
('gig-005','Corporate Laughs — Tech Summit','Annual tech company event looking for a stand-up comedian for 20-min set.','venue-002','Mumbai','Online / Hybrid',DATEADD('DAY',20,CURRENT_DATE),'14:00:00','CORPORATE_SHOW','PAID',8000,1,0,'OPEN'),
('gig-006','Kavi Sammelan — Hindi Poetry Night','Traditional Hindi poetry evening. Seeking classical and contemporary poets.','venue-003','Pune','The Ink Space',DATEADD('DAY',14,CURRENT_DATE),'19:00:00','POETRY_SLAM','PAID',2000,4,0,'OPEN');

INSERT INTO gig_art_forms (gig_id, art_form) VALUES
('gig-001','STANDUP_COMEDY'),('gig-001','POETRY'),('gig-001','SPOKEN_WORD'),('gig-001','STORYTELLING'),
('gig-002','SPOKEN_WORD'),('gig-002','POETRY'),
('gig-003','STANDUP_COMEDY'),
('gig-004','STORYTELLING'),
('gig-005','STANDUP_COMEDY'),
('gig-006','POETRY');

INSERT INTO waitlist_entries (full_name,email,city,type,art_form) VALUES
('Sneha Raut','sneha@example.com','Pune','ARTIST','POETRY'),
('Aditya Mishra','aditya@example.com','Bangalore','ARTIST','STANDUP_COMEDY');
