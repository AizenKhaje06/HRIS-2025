-- Create exit_records table
create table if not exists public.exit_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees_201(id) on delete cascade,
  resignation_date date,
  reason_for_leaving text,
  exit_interview_url text,
  final_pay_url text,
  certificate_of_employment_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exit_records enable row level security;

create policy "exit_records_select_hr_admin"
  on public.exit_records for select
  using (public.is_hr_admin(auth.uid()));

create policy "exit_records_insert_hr_admin"
  on public.exit_records for insert
  with check (public.is_hr_admin(auth.uid()));

create policy "exit_records_update_hr_admin"
  on public.exit_records for update
  using (public.is_hr_admin(auth.uid()));

create index if not exists exit_records_employee_id_idx on public.exit_records(employee_id);
