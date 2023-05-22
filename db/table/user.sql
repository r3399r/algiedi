CREATE TABLE IF NOT EXISTS user (
	id VARCHAR(36) NOT NULL,
	username VARCHAR(255) NOT NULL,
	last_project_id VARCHAR(36) NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (last_project_id) REFERENCES project(id)
);