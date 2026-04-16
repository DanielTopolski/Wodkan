/*
  # Fix handle_new_user trigger

  Updates the handle_new_user function to:
  1. Insert a profile row for the new user
  2. Wrap seed_demo_data_for_user in exception handler so signup never fails
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, '', '')
  ON CONFLICT (id) DO NOTHING;

  BEGIN
    PERFORM seed_demo_data_for_user(NEW.id);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;

  RETURN NEW;
END;
$$;
