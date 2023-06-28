CREATE TABLE IF NOT EXISTS song (
	id VARCHAR(36) NOT NULL,
	user_id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	description VARCHAR(255) NOT NULL,
	theme VARCHAR(255) NOT NULL,
	genre VARCHAR(255) NOT NULL,
	language VARCHAR(255) NOT NULL,
	caption VARCHAR(255) NOT NULL,
	cover_file_uri VARCHAR(255) NULL,
	project_id VARCHAR(36) NOT NULL,
    file_uri VARCHAR(255) NOT NULL,
	is_original BOOLEAN NOT NULL,
	inspired_id VARCHAR(36) NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (user_id) REFERENCES user(id)
);