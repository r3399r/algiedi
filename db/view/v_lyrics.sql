CREATE OR REPLACE VIEW v_lyrics AS
select l.*,
    u.username,
    p.status as project_status,
    p.created_at as project_created_at,
    p.updated_at as project_updated_at
from lyrics l
    left join user u on l.user_id = u.id
    left join project p on l.project_id = p.id;