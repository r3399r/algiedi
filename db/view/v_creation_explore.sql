CREATE OR REPLACE VIEW v_creation_explore AS
select l.id,
    0 as type,
    l.user_id,
    l.info_id,
    l.project_id,
    l.inspired_id,
    null as file_uri,
    null as tab_file_uri,
    l.lyrics_text,
	l.count_like,
    l.count_view,
    l.created_at,
    l.updated_at
from v_lyrics_explore l
union all
select t.id,
    1 as type,
    t.user_id,
    t.info_id,
    t.project_id,
    t.inspired_id,
    t.file_uri,
    t.tab_file_uri,
    null as lyrics_text,
	t.count_like,
    t.count_view,
    t.created_at,
    t.updated_at
from v_track_explore t
union all
select s.id,
    2 as type,
    null as user_id,
    s.info_id,
    s.id as project_id,
    null as inspired_id,
    s.track_file_uri as file_uri,
    s.tab_file_uri,
    s.lyrics_text,
	s.count_like,
    s.count_view,
    s.created_at,
    s.updated_at
from v_song_explore s;