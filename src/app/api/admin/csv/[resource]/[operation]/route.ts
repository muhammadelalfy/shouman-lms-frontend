import { proxyCsv } from "@/features/administration/csv/proxy";
type Context = { params: Promise<{ resource: string; operation: string }> };
async function handle(request: Request, context: Context) {
  const { resource, operation } = await context.params;
  return proxyCsv(request, resource, operation);
}
export const GET = handle;
export const POST = handle;
