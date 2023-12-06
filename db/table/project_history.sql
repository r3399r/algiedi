CREATE TABLE IF NOT EXISTS project_history (
    id VARCHAR(36) NOT NULL,
    project_id VARCHAR(36) NOT NULL,
    track_file_uri VARCHAR(255) NULL,
	tab_file_uri VARCHAR(255) NULL,
    lyrics_text TEXT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
    PRIMARY KEY (id ASC),
	FOREIGN KEY (project_id) REFERENCES project(id)
);