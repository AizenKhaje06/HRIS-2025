-- Create employees table for 201 file management
create table if not exists public.employees_201 (
  id uuid primary key default gen_random_uuid(),
  employee_id text unique not null,
  first_name text not null,
  last_name text not null,
  birth_date date,
  address text,
  contact_number text,
  email text not null,
  civil_status text,
  citizenship text,
  emergency_contact_name text,
  emergency_contact_number text,
  date_hired date not null,
  department text not null,
  position text not null,
  employment_type text check (employment_type in ('Probationary', 'Regular', 'Contractual')) not null,
  employment_status text check (employment_status in ('Active', 'Resigned')) default 'Active',
  supervisor text,
  work_location text,
  profile_photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.employees_201 enable row level security;

-- HR admins can view all employees
create policy "employees_201_select_hr_admin"
  on public.employees_201 for select
  using (public.is_hr_admin(auth.uid()));

-- Employees can view their own record
create policy "employees_201_select_own"
  on public.employees_201 for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.email = employees_201.email
    )
  );

-- HR admins can insert employees
create policy "employees_201_insert_hr_admin"
  on public.employees_201 for insert
  with check (public.is_hr_admin(auth.uid()));

-- HR admins can update employees
create policy "employees_201_update_hr_admin"
  on public.employees_201 for update
  using (public.is_hr_admin(auth.uid()));

-- HR admins can delete employees
create policy "employees_201_delete_hr_admin"
  on public.employees_201 for delete
  using (public.is_hr_admin(auth.uid()));

create index if not exists employees_201_department_idx on public.employees_201(department);
create index if not exists employees_201_employment_status_idx on public.employees_201(employment_status);
create index if not exists employees_201_email_idx on public.employees_201(email);
