import { getSupabase } from '@/lib/supabaseClient';

type SaveResultInput = {
  total_time: number;
  wpm: number;
  accuracy: number;
  correct_letters: number;
  incorrect_letters: number;
};

export const saveTypingResult = async (input: SaveResultInput) => {
  const supabase = getSupabase();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) return { ok: false, error: 'Usuário não autenticado' };
  const payload = {
    user_id: user.id,
    total_time: input.total_time,
    wpm: input.wpm,
    accuracy: input.accuracy,
    correct_letters: input.correct_letters,
    incorrect_letters: input.incorrect_letters,
  };
  const { error } = await supabase.from('typing_results').insert(payload);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
};

export const fetchUserResults = async (userId: string) => {
  const supabase = getSupabase();
  return supabase
    .from('typing_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};

type FetchFilters = {
  userId: string;
  durations?: number[];
  start?: string;
  end?: string;
  sortBy?: 'created_at' | 'wpm' | 'accuracy' | 'total_time';
  order?: 'asc' | 'desc';
  wpmMin?: number;
  accMin?: number;
  limit?: number;
  offset?: number;
};

export const fetchUserResultsFiltered = async (f: FetchFilters) => {
  const supabase = getSupabase();
  let q = supabase.from('typing_results').select('*');
  q = q.eq('user_id', f.userId);
  if (f.durations && f.durations.length > 0) q = q.in('total_time', f.durations);
  if (f.start) q = q.gte('created_at', f.start);
  if (f.end) q = q.lte('created_at', f.end);
  if (typeof f.wpmMin === 'number') q = q.gte('wpm', f.wpmMin);
  if (typeof f.accMin === 'number') q = q.gte('accuracy', f.accMin);
  const sortBy = f.sortBy ?? 'created_at';
  const desc = (f.order ?? 'desc') === 'desc';
  q = q.order(sortBy, { ascending: !desc });
  const limit = f.limit ?? 20;
  const offset = f.offset ?? 0;
  q = q.range(offset, offset + limit - 1);
  return q;
};

export const fetchLeaderboard = async (totalTime: number, limit = 50) => {
  const supabase = getSupabase();
  return supabase
    .from('typing_results')
    .select('wpm, accuracy, total_time, created_at, user_id, profiles(display_name, avatar_url)')
    .eq('total_time', totalTime)
    .order('wpm', { ascending: false })
    .limit(limit);
};
