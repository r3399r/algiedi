CREATE TABLE IF NOT EXISTS project (
	id VARCHAR(36) NOT NULL,
	status VARCHAR(255) NOT NULL,
	info_id VARCHAR(36) NOT NULL,
	count_like INT NOT NULL,
	count_view INT NOT NULL,
	started_at TIMESTAMP NULL,
	published_at TIMESTAMP NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (info_id) REFERENCES info(id)
);