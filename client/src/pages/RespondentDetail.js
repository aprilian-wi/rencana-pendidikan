import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RespondentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [respondent, setRespondent] = useState(null);

  useEffect(() => {
    const fetchRespondent = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/respondents/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRespondent(data);
        } else {
          alert('Data koresponden tidak ditemukan.');
          navigate('/dashboard');
        }
      } catch (error) {
        alert('Gagal memuat data koresponden.');
        navigate('/dashboard');
      }
    };
    fetchRespondent();
  }, [id, navigate]);

  if (!respondent) {
    return <div className="p-6">Loading...</div>;
  }

  // Generate summary of responses
  const summary = respondent.responses.map((resp) => {
    return `Pertanyaan ${resp.questionNumber}: ${resp.answer.join(', ')}`;
  }).join('; ');

  // Placeholder for relevant follow-up summary (can be enhanced)
  const followUpSummary = 'Tindak lanjut yang relevan akan disesuaikan berdasarkan jawaban koresponden.';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
      >
        &larr; Kembali ke Dashboard
      </button>
      <h1 className="text-3xl font-bold mb-6">Detail Koresponden</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Koresponden</h2>
        <p><strong>Nama Orang Tua:</strong> {respondent.parentName}</p>
        <p><strong>Nama Anak:</strong> {respondent.childName}</p>
        <p><strong>No Hp:</strong> {respondent.phone}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Detail Respon Koresponden</h2>
        <ul className="list-disc list-inside">
          {respondent.responses.map((resp) => (
            <li key={resp.questionNumber}>
              Pertanyaan {resp.questionNumber}: {resp.answer.join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Summary Respon</h2>
        <p>{summary}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Summary Tindak Lanjut</h2>
        <p>{followUpSummary}</p>
      </div>
    </div>
  );
};

export default RespondentDetail;
