CREATE OR REPLACE VIEW v_project_user AS
select pu.id,
    pu.user_id,
    pu.project_id,
    p.status,
    p.created_at,
    p.updated_at
from project_user pu
    left join project p on pu.project_id = p.id;