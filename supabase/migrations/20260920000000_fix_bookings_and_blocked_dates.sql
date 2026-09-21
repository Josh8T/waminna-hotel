-- 1. Fix RLS on public.bookings
DROP POLICY IF EXISTS "Read Own Bookings" ON public.bookings;

CREATE POLICY "Read Own Bookings" ON public.bookings FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR (auth.uid() IS NOT NULL AND guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    OR public.is_staff_or_owner()
  );

-- Secure lookup for unauthenticated users (booking reference)
CREATE OR REPLACE FUNCTION public.get_booking_by_reference(p_ref TEXT)
RETURNS SETOF public.bookings AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.bookings WHERE booking_reference = p_ref;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Allow anon to call this function
GRANT EXECUTE ON FUNCTION public.get_booking_by_reference(TEXT) TO anon, authenticated;


-- 2. Automated Date Blocking Trigger
CREATE OR REPLACE FUNCTION public.handle_booking_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Insert blocked dates for each night
    INSERT INTO public.blocked_dates (room_id, date, reason, booking_id)
    SELECT NEW.room_id, NEW.check_in + i, 'booking', NEW.id
    FROM generate_series(0, NEW.nights - 1) i;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IN ('cancelled', 'completed') AND OLD.status NOT IN ('cancelled', 'completed') THEN
      -- Remove blocked dates when cancelled
      DELETE FROM public.blocked_dates WHERE booking_id = NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_booking_status_change ON public.bookings;
CREATE TRIGGER on_booking_status_change
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_booking_dates();


-- 3. Security Advisor Fixes
ALTER FUNCTION public.is_staff_or_owner() SET search_path = public;
ALTER FUNCTION public.is_owner() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;


-- 4. Performance Advisor Fixes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_email ON public.bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_booking_id ON public.blocked_dates(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_room_id ON public.reviews(room_id);
