CREATE TABLE lyrics (
	id VARCHAR(36) NOT NULL,
	lyrics VARCHAR(255) NOT NULL,
	project_id VARCHAR(36) NOT NULL,
	inspired_project_id VARCHAR(36),
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (inspired_project_id) REFERENCES project(id)
);