CREATE TABLE IF NOT EXISTS `notification` (
	id VARCHAR(36) NOT NULL,
	to_user_id VARCHAR(36) NOT NULL,
	is_read BOOLEAN NOT NULL,
	type VARCHAR(255) NOT NULL,
	from_user_id VARCHAR(36) NOT NULL,
	target_id VARCHAR(36) NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (to_user_id) REFERENCES user(id),
	FOREIGN KEY (from_user_id) REFERENCES user(id)
);