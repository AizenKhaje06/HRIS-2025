-- Create audit_logs table for tracking all file access and edits
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  employee_id uuid references public.employees_201(id) on delete cascade,
  action text not null,
  table_name text not null,
  record_id uuid,
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;

create policy "audit_logs_select_hr_admin"
  on public.audit_logs for select
  using (public.is_hr_admin(auth.uid()));

create policy "audit_logs_insert_own"
  on public.audit_logs for insert
  with check (auth.uid() = user_id);

create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);
create index if not exists audit_logs_employee_id_idx on public.audit_logs(employee_id);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at);
