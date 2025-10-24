-- Create government_info table
create table if not exists public.government_info (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees_201(id) on delete cascade,
  sss_number text,
  pagibig_number text,
  philhealth_number text,
  tin_number text,
  sss_form_url text,
  pagibig_form_url text,
  philhealth_mdr_url text,
  bir_2316_url text,
  contribution_status text check (contribution_status in ('Active', 'Inactive')) default 'Active',
  last_contribution_update date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.government_info enable row level security;

create policy "government_info_select_hr_admin"
  on public.government_info for select
  using (public.is_hr_admin(auth.uid()));

create policy "government_info_select_own"
  on public.government_info for select
  using (
    exists (
      select 1 from public.employees_201
      where employees_201.id = government_info.employee_id
      and employees_201.email = (select email from public.profiles where id = auth.uid())
    )
  );

create policy "government_info_insert_hr_admin"
  on public.government_info for insert
  with check (public.is_hr_admin(auth.uid()));

create policy "government_info_update_hr_admin"
  on public.government_info for update
  using (public.is_hr_admin(auth.uid()));

create index if not exists government_info_employee_id_idx on public.government_info(employee_id);
