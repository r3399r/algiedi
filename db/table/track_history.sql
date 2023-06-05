CREATE TABLE IF NOT EXISTS track_history (
    id VARCHAR(36) NOT NULL,
    track_id VARCHAR(36) NOT NULL,
    file_uri VARCHAR(255) NOT NULL,
	tab_file_uri VARCHAR(255) NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
    PRIMARY KEY (id ASC),
	FOREIGN KEY (track_id) REFERENCES track(id)
);