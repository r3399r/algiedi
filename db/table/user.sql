CREATE TABLE IF NOT EXISTS user (
	id VARCHAR(36) NOT NULL,
	email VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	role VARCHAR(255) NULL,
	age INT NULL,
	region VARCHAR(255) NULL,
	language VARCHAR(255) NULL,
	bio VARCHAR(255) NULL,
	tag VARCHAR(255) NULL,
	facebook VARCHAR(255) NULL,
	instagram VARCHAR(255) NULL,
	youtube VARCHAR(255) NULL,
	soundcloud VARCHAR(255) NULL,
	avatar VARCHAR(255) NULL,
	last_project_id VARCHAR(36) NULL,
	connection_id VARCHAR(255) NULL,
	last_sent_at TIMESTAMP NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (last_project_id) REFERENCES project(id)
);