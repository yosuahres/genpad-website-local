export function getStorageUrl(path: string | undefined): string {
  if (!path) return '#';
  if (path.startsWith('http')) return path;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/documents/${path}`;
}