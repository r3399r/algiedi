CREATE OR REPLACE VIEW v_lyrics AS
select l.*,
    latest_lyrics.content,
    u.username,
    p.status as project_status,
    p.started_at as project_started_at,
    p.created_at as project_created_at,
    p.updated_at as project_updated_at
from lyrics l
    left join user u on l.user_id = u.id
    left join project p on l.project_id = p.id
    left join (
        SELECT lh.lyrics_id,
            lh.content,
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