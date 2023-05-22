CREATE TABLE IF NOT EXISTS project_user (
	id VARCHAR(36) NOT NULL,
	project_id VARCHAR(36) NOT NULL,
	user_id VARCHAR(36) NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (user_id) REFERENCES user(id),
	UNIQUE (project_id, user_id)
);