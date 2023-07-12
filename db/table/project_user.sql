CREATE TABLE IF NOT EXISTS project_user (
	id VARCHAR(36) NOT NULL,
	project_id VARCHAR(36) NOT NULL,
	user_id VARCHAR(36) NOT NULL,
	lyrics_id VARCHAR(36) NULL,
	track_id VARCHAR(36) NULL,
	role VARCHAR(255) NOT NULL,
	is_accepted BOOLEAN NULL,
	is_ready BOOLEAN NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (lyrics_id) REFERENCES lyrics(id),
	FOREIGN KEY (track_id) REFERENCES track(id),
	UNIQUE (project_id, user_id)
);