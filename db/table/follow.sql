CREATE TABLE IF NOT EXISTS follow (
	id VARCHAR(36) NOT NULL,
	follower_id VARCHAR(36) NOT NULL,
	followee_id VARCHAR(36) NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
	PRIMARY KEY (id ASC),
	FOREIGN KEY (follower_id) REFERENCES user(id),
	FOREIGN KEY (followee_id) REFERENCES user(id),
	UNIQUE (follower_id, followee_id)
);