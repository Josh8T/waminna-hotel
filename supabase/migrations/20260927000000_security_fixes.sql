-- ========================================================
-- SECURITY FIXES MIGRATION
-- 1. Fix RLS bookings leak
-- 2. Prevent role privilege escalation on profiles
-- 3. Secure unauthenticated guest booking lookup via RPC
-- 4. Harden new user trigger for Google/Apple OAuth & default role
-- ========================================================

-- 1. FIX BOOKINGS RLS POLICY
-- Drop legacy insecure policies if they exist
DROP POLICY IF EXISTS "Public Read Own Bookings" ON public.bookings;
DROP POLICY IF EXISTS "Read Own Bookings" ON public.bookings;

-- Authenticated guests can only view their own bookings; staff and owners can view all.
CREATE POLICY "Read Own Bookings" ON public.bookings FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR public.is_staff_or_owner()
  );

-- 2. SECURE GUEST BOOKING LOOKUP RPC
-- Allows guest confirmation page or lookup without giving anonymous SELECT access to the whole table
CREATE OR REPLACE FUNCTION public.get_booking_by_reference(
  p_booking_reference TEXT,
  p_guest_email TEXT
)
RETURNS SETOF public.bookings
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT * FROM public.bookings
  WHERE booking_reference = p_booking_reference
    AND LOWER(guest_email) = LOWER(p_guest_email)
  LIMIT 1;
$$;

-- Grant execution to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_booking_by_reference(TEXT, TEXT) TO anon, authenticated;

-- 3. PREVENT PRIVILEGE ESCALATION ON PROFILES
-- Drop existing update policies on profiles to re-structure securely
DROP POLICY IF EXISTS "User Update Own Profile" ON public.profiles;
DROP POLICY IF EXISTS "Owner Update Any Profile" ON public.profiles;

-- Regular users can update their profile information
CREATE POLICY "User Update Own Profile" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger function to ensure non-owners cannot modify the 'role' column
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_owner() THEN
      RAISE EXCEPTION 'Unauthorized: Only owners can modify user roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_protect_profile_role ON public.profiles;

CREATE TRIGGER trigger_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- 4. HARDEN AUTO-PROFILE TRIGGER FOR GOOGLE / APPLE OAUTH & ENFORCE ROLE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
BEGIN
  -- Safely extract first and last name from various OAuth metadata formats
  -- (Google: full_name/name, Apple: name { firstName, lastName }, or standard email signup)
  v_first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->'name'->>'firstName',
    SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1),
    SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 1),
    ''
  );

  v_last_name := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->'name'->>'lastName',
    NULLIF(SUBSTRING(NEW.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1), ''),
    NULLIF(SUBSTRING(NEW.raw_user_meta_data->>'name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'name') + 1), ''),
    ''
  );

  -- Always enforce 'user' role on signup; never allow client metadata to escalate to staff/owner
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    v_first_name,
    v_last_name,
    'user'::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
