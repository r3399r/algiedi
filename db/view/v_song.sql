CREATE OR REPLACE VIEW v_song AS
select s.*,
    u.username,
    p.status as project_status,
    p.started_at as project_started_at,
    p.created_at as project_created_at,
    p.updated_at as project_updated_at
from song s
    left join user u on s.user_id = u.id
    left join project p on s.project_id = p.id;