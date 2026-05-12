-- Demo seed example (requires authenticated user IDs from Supabase Auth)
-- Replace USER_ID with a valid auth.users.id before running.

insert into agenda_settings (user_id, opening_time, closing_time, appointment_duration_minutes, interval_minutes, default_view)
values ('00000000-0000-0000-0000-000000000000', '08:00', '18:00', 60, 15, 'week')
on conflict (user_id) do nothing;

