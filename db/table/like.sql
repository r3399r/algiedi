CREATE TABLE IF NOT EXISTS `like` (
	id VARCHAR(36) NOT NULL,
	user_id VARCHAR(36) NOT NULL,
	creation_id VARCHAR(36) NOT NULL,
	type FLOAT NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (user_id) REFERENCES user(id),
	UNIQUE (user_id, creation_id)
);