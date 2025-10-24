-- Create compliance_legal table
create table if not exists public.compliance_legal (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees_201(id) on delete cascade,
  nda_file_url text,
  company_policy_ack_url text,
  clearance_cert_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.compliance_legal enable row level security;

create policy "compliance_legal_select_hr_admin"
  on public.compliance_legal for select
  using (public.is_hr_admin(auth.uid()));

create policy "compliance_legal_select_own"
  on public.compliance_legal for select
  using (
    exists (
      select 1 from public.employees_201
      where employees_201.id = compliance_legal.employee_id
      and employees_201.email = (select email from public.profiles where id = auth.uid())
    )
  );

create policy "compliance_legal_insert_hr_admin"
  on public.compliance_legal for insert
  with check (public.is_hr_admin(auth.uid()));

create policy "compliance_legal_update_hr_admin"
  on public.compliance_legal for update
  using (public.is_hr_admin(auth.uid()));

create index if not exists compliance_legal_employee_id_idx on public.compliance_legal(employee_id);
