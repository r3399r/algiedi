CREATE TABLE IF NOT EXISTS caption (
	id VARCHAR(36) NOT NULL,
	name VARCHAR(255) NOT NULL,
	info_id VARCHAR(36) NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	UNIQUE KEY (name, info_id),
	FOREIGN KEY (info_id) REFERENCES info(id)
);