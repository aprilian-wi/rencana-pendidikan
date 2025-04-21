import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [respondents, setRespondents] = useState([]);
  const navigate = useNavigate();

  const fetchRespondents = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/respondents`);
      const data = await res.json();
      setRespondents(data);
    } catch (error) {
      alert('Gagal memuat data koresponden.');
    }
  };

  useEffect(() => {
    fetchRespondents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data koresponden ini?')) {
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/respondents/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Data koresponden berhasil dihapus.');
        fetchRespondents();
      } else {
        alert('Gagal menghapus data koresponden.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus data.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Koresponden</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">No</th>
            <th className="border border-gray-300 px-4 py-2">Nama Orang Tua</th>
            <th className="border border-gray-300 px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {respondents.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-4">Belum ada data koresponden.</td>
            </tr>
          ) : (
            respondents.map((resp, index) => (
              <tr key={resp._id} className="hover:bg-gray-50 cursor-pointer">
                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                <td
                  className="border border-gray-300 px-4 py-2 text-blue-600 underline"
                  onClick={() => navigate(`/respondent/${resp._id}`)}
                >
                  {resp.parentName}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(resp._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
