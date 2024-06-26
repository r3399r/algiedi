CREATE TABLE IF NOT EXISTS chat (
	id VARCHAR(36) NOT NULL,
	user_id VARCHAR(36) NOT NULL,
	project_id VARCHAR(36) NOT NULL,
	content VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (project_id) REFERENCES project(id)
);