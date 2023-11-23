import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type children = {
    userid: string;
    poemid: number
}

export async function hasUserResponded ({userid,poemid}:children) {
    const supabase = createClientComponentClient();
    const { data, error } = await supabase.from('responses')
        .select('*')
        .eq("user_id", userid)
        .eq("poem_id",poemid);
    if (error) {
        console.log(error);
      }
    return data
}
