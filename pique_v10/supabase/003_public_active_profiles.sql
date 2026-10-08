create policy "anyone can view active professional profiles"
on public.professional_profiles
for select
using (active = true);
