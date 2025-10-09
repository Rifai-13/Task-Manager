create policy "Anyone can delete tasks"
on "public"."tasks"
as permissive
for delete
to anon
using (true);


create policy "Anyone can insert"
on "public"."tasks"
as permissive
for insert
to anon
with check (true);


create policy "Anyone can update tasks"
on "public"."tasks"
as permissive
for update
to anon
using (true)
with check (true);



