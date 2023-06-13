CREATE OR REPLACE VIEW v_track AS
select t.*,
    latest_track.file_uri,
    latest_track.tab_file_uri,
    u.username,
    p.status as project_status,
    p.started_at as project_started_at,
    p.created_at as project_created_at,
    p.updated_at as project_updated_at
from track t
    left join user u on t.user_id = u.id
    left join project p on t.project_id = p.id
    left join (
        SELECT th.track_id,
            th.file_uri,
            th.tab_file_uri,
            th.created_at
        FROM track_history th
            join (
                select track_id,
                    MAX(created_at) as latest_created_at
                from track_history
                GROUP by track_id
            ) tmp on th.track_id = tmp.track_id
            and th.created_at = tmp.latest_created_at
    ) latest_track on t.id = latest_track.track_id;