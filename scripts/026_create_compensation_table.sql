-- Create compensation table
create table if not exists public.compensation (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees_201(id) on delete cascade,
  basic_salary decimal(12, 2),
  allowances jsonb default '{}'::jsonb,
  salary_history jsonb default '[]'::jsonb,
  payroll_account text,
  payslip_urls jsonb default '[]'::jsonb,
  thirteenth_month decimal(12, 2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.compensation enable row level security;

create policy "compensation_select_hr_admin"
  on public.compensation for select
  using (public.is_hr_admin(auth.uid()));

create policy "compensation_select_own"
  on public.compensation for select
  using (
    exists (
      select 1 from public.employees_201
      where employees_201.id = compensation.employee_id
      and employees_201.email = (select email from public.profiles where id = auth.uid())
    )
  );

create policy "compensation_insert_hr_admin"
  on public.compensation for insert
  with check (public.is_hr_admin(auth.uid()));

create policy "compensation_update_hr_admin"
  on public.compensation for update
  using (public.is_hr_admin(auth.uid()));

create index if not exists compensation_employee_id_idx on public.compensation(employee_id);
