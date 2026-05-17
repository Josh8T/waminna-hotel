import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getUsers, updateUserRole, initializeData } from '@/lib/data';
import type { User, UserRole } from '@/lib/data';
import AdminLayout from '@/components/AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    initializeData();
    setUsers(getUsers());
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !search ||
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  const handleRoleChange = (id: number, role: UserRole) => {
    updateUserRole(id, role);
    setUsers(getUsers());
  };

  const roleBadge = (role: string) => {
    const map: Record<string, string> = {
      owner: 'bg-teal-light text-teal border-teal',
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
      <h1 className="text-xl font-semibold text-[#1a1917] mb-4">Users</h1>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8984]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-warm-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-warm-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-warm-tertiary border-b border-warm-border">
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Name</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Email</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Role</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Joined</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-medium tracking-wider uppercase text-[#8a8984]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-[#8a8984]">
                    No users found
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
                    <td className="px-4 py-3 text-sm text-[#5c5a54]">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 border border-warm-border rounded-md text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal"
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
    </AdminLayout>
  );
}
