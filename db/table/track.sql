CREATE TABLE IF NOT EXISTS track (
	id VARCHAR(36) NOT NULL,
	user_id VARCHAR(36) NOT NULL,
	info_id VARCHAR(36) NOT NULL,
	project_id VARCHAR(36) NULL,
	inspired_id VARCHAR(36) NULL,
	count_like INT NOT NULL,
	count_view INT NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (project_id) REFERENCES project(id),
	FOREIGN KEY (user_id) REFERENCES user(id),
	FOREIGN KEY (info_id) REFERENCES info(id)
);