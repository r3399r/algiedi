CREATE OR REPLACE VIEW v_track AS
select t.*,
    u.username,
    p.status as project_status,
    p.created_at as project_created_at,
    p.updated_at as project_updated_at
from track t
    left join user u on t.user_id = u.id
    left join project p on t.project_id = p.id;