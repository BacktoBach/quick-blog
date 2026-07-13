import { mockUsers } from '../mock/data';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="text-red-500 font-semibold mb-4">⚠️ Khu vực giới hạn - Chỉ Admin mới có quyền vào</p>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="font-medium mb-2">Danh sách User hệ thống ({mockUsers.length} thành viên):</p>
        <ul className="list-disc pl-5">
          {mockUsers.map(u => <li key={u.id}>{u.username} - ({u.role})</li>)}
        </ul>
      </div>
    </div>
  );
}