-- Enable RLS (just in case) but allow ALL access for authenticated users, 
-- or simply disable RLS if you don't need user-level security yet.
-- Since this is an Admin panel, let's just allow all actions for now.

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.employees;
CREATE POLICY "Allow all" ON public.employees FOR ALL USING (true);

ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.attendance;
CREATE POLICY "Allow all" ON public.attendance FOR ALL USING (true);

ALTER TABLE public.cash_advances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.cash_advances;
CREATE POLICY "Allow all" ON public.cash_advances FOR ALL USING (true);

ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.payroll;
CREATE POLICY "Allow all" ON public.payroll FOR ALL USING (true);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.payments;
CREATE POLICY "Allow all" ON public.payments FOR ALL USING (true);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.services;
CREATE POLICY "Allow all" ON public.services FOR ALL USING (true);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all" ON public.customers;
CREATE POLICY "Allow all" ON public.customers FOR ALL USING (true);
