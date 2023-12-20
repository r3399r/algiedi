CREATE OR REPLACE VIEW v_lyrics_explore AS with public_lyrics as (
        select lh.id,
            lh.lyrics_id,
            lh.lyrics_text,
            lh.created_at
        from lyrics_history lh
            left join lyrics l on l.id = lh.lyrics_id
            left join project p on p.id = l.project_id
        where lh.created_at < p.started_at
            OR p.started_at is NULL
    )
select l.id,
    l.user_id,
    l.info_id,
    l.project_id,
    l.inspired_id,
	l.count_like,
    l.count_view,
    l.created_at,
    l.updated_at,
    latest_lyrics.lyrics_text
from lyrics l
    left join (
        SELECT pl.lyrics_id,
            pl.lyrics_text,
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