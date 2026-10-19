import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yxrgohkztwuhxhexxitm.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_lXMGKLj2MLveWSG3KuvZ3Q_SFG6pWdG'

const storage = typeof window !== 'undefined' ? window.localStorage : undefined;

const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    storageKey: 'menteelog.sim.auth.token',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Sandbox wrapper: allows authentication & initial read queries, but intercepts all
// insert / update / delete / upsert operations so simulation testing never mutates
// the live production database used by the main MenteeLog folder.
function createSandboxedQueryBuilder(table) {
  const realBuilder = realSupabase.from(table);
  const makeMockMutationChain = (payload = null) => {
    const mockRows = Array.isArray(payload)
      ? payload.map(r => ({ id: r.id || crypto.randomUUID(), ...r }))
      : payload && typeof payload === 'object'
        ? [{ id: payload.id || crypto.randomUUID(), ...payload }]
        : [{ id: crypto.randomUUID() }];
    const chain = {
      select: () => chain,
      eq: () => chain,
      in: () => chain,
      neq: () => chain,
      lte: () => chain,
      gte: () => chain,
      ilike: () => chain,
      single: () => Promise.resolve({ data: mockRows[0], error: null }),
      maybeSingle: () => Promise.resolve({ data: mockRows[0], error: null }),
      then: (resolve, reject) => Promise.resolve({ data: mockRows, error: null }).then(resolve, reject),
      catch: (fn) => Promise.resolve({ data: mockRows, error: null }).catch(fn)
    };
    return chain;
  };

  return new Proxy(realBuilder, {
    get(target, prop) {
      if (prop === 'insert' || prop === 'update' || prop === 'upsert') {
        return (values) => makeMockMutationChain(values);
      }
      if (prop === 'delete') {
        return () => makeMockMutationChain();
      }
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
  });
}

export const supabase = new Proxy(realSupabase, {
  get(target, prop) {
    if (prop === 'from') {
      return (table) => createSandboxedQueryBuilder(table);
    }
    const val = target[prop];
    return typeof val === 'function' ? val.bind(target) : val;
  }
});
