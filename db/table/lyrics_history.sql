CREATE TABLE IF NOT EXISTS lyrics_history (
    id VARCHAR(36) NOT NULL,
    lyrics_id VARCHAR(36) NOT NULL,
    lyrics_text TEXT NOT NULL,
	created_at TIMESTAMP NULL,
	updated_at TIMESTAMP NULL,
    PRIMARY KEY (id ASC),
	FOREIGN KEY (lyrics_id) REFERENCES lyrics(id)
);