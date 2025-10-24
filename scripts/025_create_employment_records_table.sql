-- Create employment_records table
create table if not exists public.employment_records (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees_201(id) on delete cascade,
  contract_file_url text,
  promotion_history jsonb default '[]'::jsonb,
  performance_file_urls jsonb default '[]'::jsonb,
  disciplinary_file_urls jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.employment_records enable row level security;

create policy "employment_records_select_hr_admin"
  on public.employment_records for select
  using (public.is_hr_admin(auth.uid()));

create policy "employment_records_select_own"
  on public.employment_records for select
  using (
    exists (
      select 1 from public.employees_201
      where employees_201.id = employment_records.employee_id
      and employees_201.email = (select email from public.profiles where id = auth.uid())
    )
  );

create policy "employment_records_insert_hr_admin"
  on public.employment_records for insert
  with check (public.is_hr_admin(auth.uid()));

create policy "employment_records_update_hr_admin"
  on public.employment_records for update
  using (public.is_hr_admin(auth.uid()));

create index if not exists employment_records_employee_id_idx on public.employment_records(employee_id);
