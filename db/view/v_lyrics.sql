CREATE OR REPLACE VIEW v_lyrics AS
select l.id,
    l.user_id,
    l.info_id,
    l.project_id,
    l.inspired_id,
	l.count_like,
    l.created_at,
    l.updated_at,
    latest_lyrics.lyrics_text
from lyrics l
    left join user u on l.user_id = u.id
    left join project p on l.project_id = p.id
    left join info i on l.info_id = i.id
    left join (
        SELECT lh.lyrics_id,
            lh.lyrics_text,
            lh.created_at
        FROM lyrics_history lh
            join (
                select lyrics_id,
                    MAX(created_at) as latest_created_at
                from lyrics_history
                GROUP by lyrics_id
            ) tmp on lh.lyrics_id = tmp.lyrics_id
            and lh.created_at = tmp.latest_created_at
    ) latest_lyrics on l.id = latest_lyrics.lyrics_id;