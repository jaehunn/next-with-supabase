import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

/**
 * 인증된 사용자만 접근할 수 있는 페이지
 */
export default async function PrivatePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  return <p>Hello {data.user.email}</p>;
}
