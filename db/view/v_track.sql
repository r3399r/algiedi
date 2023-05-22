CREATE OR REPLACE VIEW v_track AS
select t.*,
    u.username
from track t
    left join user u on t.user_id = u.id;