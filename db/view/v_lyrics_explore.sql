CREATE OR REPLACE VIEW v_lyrics_explore AS with public_lyrics as (
        select lh.id,
            lh.lyrics_id,
            lh.content,
            lh.created_at
        from lyrics_history lh
            left join lyrics l on l.id = lh.lyrics_id
            left join project p on p.id = l.project_id
        where lh.created_at < p.started_at
            OR p.started_at is NULL
    )
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
        SELECT pl.lyrics_id,
            pl.content,
            pl.created_at
        FROM public_lyrics pl
            join (
                select lyrics_id,
                    MAX(created_at) as latest_created_at
                from public_lyrics
                GROUP by lyrics_id
            ) tmp on pl.lyrics_id = tmp.lyrics_id
            and pl.created_at = tmp.latest_created_at
    ) latest_lyrics on l.id = latest_lyrics.lyrics_id;