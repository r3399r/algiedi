CREATE OR REPLACE VIEW v_song AS
select p.id,
    i.name,
    i.description,
    i.theme,
    i.genre,
    i.language,
    i.caption,
    i.cover_file_uri,
    latest_project.track_file_uri,
    latest_project.tab_file_uri,
    latest_project.lyrics_text,
    p.status,
    p.started_at,
    p.created_at,
    p.updated_at
from project p
    left join info i on p.info_id = i.id
    left join (
        SELECT ph.project_id,
            ph.track_file_uri,
            ph.tab_file_uri,
            ph.lyrics_text,
            ph.created_at
        FROM project_history ph
            join (
                select project_id,
                    MAX(created_at) as latest_created_at
                from project_history
                GROUP by project_id
            ) tmp on ph.project_id = tmp.project_id
            and ph.created_at = tmp.latest_created_at
    ) latest_project on p.id = latest_project.project_id;