ALTER TABLE rooms ADD COLUMN last_night_summary JSONB DEFAULT '{}'::jsonb;
