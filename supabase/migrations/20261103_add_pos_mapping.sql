-- Add POS room code and rate code mapping to rooms table
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS pos_room_code TEXT,
ADD COLUMN IF NOT EXISTS pos_rate_code TEXT DEFAULT 'RACKPRI';

-- Populate existing default room codes
UPDATE public.rooms SET pos_room_code = 'SGL', pos_rate_code = 'RACKPRI' WHERE type = 'standard' AND pos_room_code IS NULL;
UPDATE public.rooms SET pos_room_code = 'DLX', pos_rate_code = 'RACKPRI' WHERE type = 'deluxe' AND pos_room_code IS NULL;
UPDATE public.rooms SET pos_room_code = 'STE', pos_rate_code = 'RACKPRI' WHERE type = 'suite' AND pos_room_code IS NULL;

