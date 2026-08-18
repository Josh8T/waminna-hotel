import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import type { UserRole } from '@/lib/data';
import type { AuthUser } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, role, created_at')
        .order('created_at', { ascending: false });

      if (err) throw err;

      const mapped: AuthUser[] = (data || []).map((p) => ({
        id: p.id,
        email: p.email,
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        phone: p.phone ?? null,
        role: p.role as UserRole,
      }));
      setUsers(mapped);
    } catch {
      setError('Failed to load users. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (id: string, role: UserRole) => {
    // Optimistic update
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role } : u));

    const { error: err } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id);

    if (err) {
      // Revert on failure
      await loadUsers();
      alert('Failed to update role. You may not have permission.');
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !search ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      owner: 'bg-brand-light text-brand border-brand',
      staff: 'bg-blue-50 text-blue-700 border-blue-200',
      user: 'bg-green-50 text-green-700 border-green-200',
      guest: 'bg-warm-tertiary text-[#8a8984] border-warm-border',
    };
    return (
      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize ${map[role] || map.guest}`}>
        {role}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-[#1a1917]">Users</h1>
        <button
          onClick={loadUsers}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-warm-border rounded-md hover:bg-warm-bg transition-colors text-[#5c5a54]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8984]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-warm-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-warm-tertiary border-b border-warm-border">
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Name</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Email</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Role</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <div className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-sm text-[#8a8984]">
                    {search ? 'No users match your search' : 'No users found'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="border-b border-warm-border last:border-0 hover:bg-warm-bg transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#1a1917]">
                        {u.firstName} {u.lastName}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5c5a54]">{u.email}</td>
                    <td className="px-4 py-3">{roleBadge(u.role)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 border border-warm-border rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                      >
                        <option value="guest">Guest</option>
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="owner">Owner</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#8a8984]">
        Roles are stored server-side in Supabase — changes take effect immediately.
      </p>
    </AdminLayout>
  );
}
