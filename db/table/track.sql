CREATE TABLE track (
	id VARCHAR(36) NOT NULL,
	file_uri VARCHAR(255) NOT NULL,
	tab_file_uri VARCHAR(255) NULL,
	project_id VARCHAR(36),
	inspired_project_id VARCHAR(36),
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (inspired_project_id) REFERENCES project(id)
);