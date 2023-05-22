CREATE OR REPLACE VIEW v_lyrics AS
select l.*,
    u.username
from lyrics l
    left join user u on l.user_id = u.id;