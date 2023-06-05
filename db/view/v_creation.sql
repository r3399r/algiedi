CREATE OR REPLACE VIEW v_creation AS
select l.id,
    'lyrics' as type,
    l.user_id,
    l.name,
    l.description,
    l.theme,
    l.genre,
    l.language,
    l.caption,
    l.cover_file_uri,
    null as file_uri,
    null as tab_file_uri,
    l.lyrics,
    l.project_id,
    l.is_original,
    l.inspired_id,
    l.status,
    l.created_at,
    l.updated_at,
    l.username,
    l.project_status,
    l.project_created_at,
    l.project_updated_at
from v_lyrics l
union all
select t.id,
    'track' as type,
    t.user_id,
    t.name,
    t.description,
    t.theme,
    t.genre,
    t.language,
    t.caption,
    t.cover_file_uri,
    t.file_uri,
    t.tab_file_uri,
    null as lyrics,
    t.project_id,
    t.is_original,
    t.inspired_id,
    t.status,
    t.created_at,
    t.updated_at,
    t.username,
    t.project_status,
    t.project_created_at,
    t.project_updated_at
from v_track t;