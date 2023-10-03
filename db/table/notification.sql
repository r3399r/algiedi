CREATE TABLE IF NOT EXISTS `notification` (
	id VARCHAR(36) NOT NULL,
	to_user_id VARCHAR(36) NOT NULL,
	is_read BOOLEAN NOT NULL,
	type VARCHAR(255) NOT NULL,
	from_user_id VARCHAR(36) NOT NULL,
	project_id VARCHAR(36) NULL,
	lyrics_id VARCHAR(36) NULL,
	track_id VARCHAR(36) NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (to_user_id) REFERENCES user(id),
	FOREIGN KEY (from_user_id) REFERENCES user(id),
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (lyrics_id) REFERENCES lyrics(id),
	FOREIGN KEY (track_id) REFERENCES track(id)
);