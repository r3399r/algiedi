CREATE OR REPLACE VIEW v_track AS
select t.id,
    t.user_id,
    t.info_id,
    t.project_id,
    t.inspired_id,
	t.count_like,
    t.created_at,
    t.updated_at,
    latest_track.file_uri,
    latest_track.tab_file_uri
from track t
    left join user u on t.user_id = u.id
    left join project p on t.project_id = p.id
    left join info i on t.info_id = i.id
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