CREATE OR REPLACE VIEW v_track_explore AS with public_track as (
        select th.id,
            th.track_id,
            th.file_uri,
            th.tab_file_uri,
            th.created_at
        from track_history th
            left join track t on t.id = th.track_id
            left join project p on p.id = t.project_id
        where th.created_at < p.started_at
            OR p.started_at is NULL
    )
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
        SELECT pt.track_id,
            pt.file_uri,
            pt.tab_file_uri,
            pt.created_at
        FROM public_track pt
            join (
                select track_id,
                    MAX(created_at) as latest_created_at
                from track_history
                GROUP by track_id
            ) tmp on pt.track_id = tmp.track_id
            and pt.created_at = tmp.latest_created_at
    ) latest_track on t.id = latest_track.track_id;