import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RespondentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [respondent, setRespondent] = useState(null);

  useEffect(() => {
    const fetchRespondent = async () => {
      try {
        const res = await fetch(`https://rencana-pendidikan-api.vercel.app/api/respondents/${id}`);
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

  // Generate descriptive analysis of responses
  const generateAnalysis = () => {
    const responses = respondent.responses;
    let analysis = [];

    // Analyze financial readiness
    const q4Response = responses.find(r => r.questionNumber === 4)?.answer[0];
    const q7Response = responses.find(r => r.questionNumber === 7)?.answer[0];
    if (q4Response && q7Response) {
      if (q4Response === 'Sudah ada dan rutin dijalankan') {
        analysis.push('Anda sudah memiliki perencanaan keuangan yang baik untuk pendidikan anak.');
      } else if (q4Response === 'Sudah ada, tapi belum konsisten') {
        analysis.push('Anda sudah memulai perencanaan keuangan, namun masih perlu ditingkatkan konsistensinya.');
      } else {
        analysis.push('Anda belum memiliki perencanaan keuangan yang terstruktur untuk pendidikan anak.');
      }

      if (q7Response.includes('Di bawah Rp 100.000')) {
        analysis.push('Alokasi dana pendidikan saat ini masih minimal.');
      } else if (q7Response.includes('Di atas Rp 500.000')) {
        analysis.push('Anda memiliki komitmen alokasi dana yang cukup signifikan untuk pendidikan.');
      }
    }

    // Analyze awareness and concerns
    const q1Response = responses.find(r => r.questionNumber === 1)?.answer[0];
    const q5Response = responses.find(r => r.questionNumber === 5)?.answer;
    if (q1Response && q5Response) {
      analysis.push(`Fokus utama Anda dalam memandang masa depan anak adalah ${q1Response.toLowerCase()}.`);
      if (q5Response.includes('Biaya yang makin naik')) {
        analysis.push('Anda memiliki kesadaran yang baik tentang tantangan biaya pendidikan di masa depan.');
      }
    }

    // Analyze readiness for solution
    const q8Response = responses.find(r => r.questionNumber === 8)?.answer[0];
    const q10Response = responses.find(r => r.questionNumber === 10)?.answer[0];
    if (q8Response && q10Response) {
      if (q8Response === 'Iya, sangat tertarik') {
        analysis.push('Anda menunjukkan ketertarikan yang tinggi terhadap solusi perencanaan pendidikan syariah.');
      }
      if (q10Response === 'Belum pernah sama sekali') {
        analysis.push('Anda belum memiliki pengalaman dengan produk asuransi pendidikan sebelumnya.');
      }
    }

    return analysis.join(' ');
  };

  // Generate follow-up recommendations
  const generateRecommendations = () => {
    const responses = respondent.responses;
    let recommendations = [];

    // Financial planning recommendations
    const q4Response = responses.find(r => r.questionNumber === 4)?.answer[0];
    const q7Response = responses.find(r => r.questionNumber === 7)?.answer[0];
    if (q4Response.includes('belum') || q4Response.includes('belum konsisten')) {
      recommendations.push('1. Mulai menyusun rencana keuangan bulanan dengan alokasi khusus untuk dana pendidikan.');
    }
    if (q7Response.includes('Di bawah') || q7Response.includes('Belum')) {
      recommendations.push('2. Evaluasi pengeluaran bulanan untuk mengoptimalkan alokasi dana pendidikan.');
    }

    // Education planning recommendations
    const q2Response = responses.find(r => r.questionNumber === 2)?.answer[0];
    if (q2Response.includes('belum') || q2Response.includes('belum spesifik')) {
      recommendations.push('3. Diskusikan target pendidikan anak dengan lebih spesifik bersama pasangan.');
    }

    // Product recommendations
    const q8Response = responses.find(r => r.questionNumber === 8)?.answer[0];
    const q11Response = responses.find(r => r.questionNumber === 11)?.answer[0];
    if (q8Response.includes('tertarik')) {
      if (q11Response.includes('chat')) {
        recommendations.push('4. Jadwalkan konsultasi online untuk membahas solusi perencanaan pendidikan syariah yang sesuai.');
      } else if (q11Response.includes('ketemu')) {
        recommendations.push('4. Jadwalkan pertemuan langsung untuk konsultasi mendalam tentang solusi perencanaan pendidikan syariah.');
      }
    }

    // Immediate action recommendations
    const q9Response = responses.find(r => r.questionNumber === 9)?.answer[0];
    if (q9Response.includes('Mulai sekarang')) {
      recommendations.push('5. Segera mulai program perencanaan pendidikan untuk memaksimalkan periode persiapan.');
    }

    return recommendations.join('\n');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition flex items-center space-x-2"
        >
          <span>&larr;</span>
          <span>Kembali ke Dashboard</span>
        </button>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Koresponden</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Nama Orang Tua</p>
                <p className="font-medium">{respondent.parentName}</p>
              </div>
              <div>
                <p className="text-gray-600">Nama Anak</p>
                <p className="font-medium">{respondent.childName}</p>
              </div>
              <div>
                <p className="text-gray-600">No Hp</p>
                <p className="font-medium">{respondent.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Respon</h2>
            <div className="space-y-4">
              {respondent.responses.map((resp) => (
                <div key={resp.questionNumber} className="pb-4 border-b border-gray-100 last:border-0">
                  <p className="font-medium text-gray-800">Pertanyaan {resp.questionNumber}</p>
                  <p className="text-gray-600 mt-1">Jawaban: {resp.answer.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary Respon</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {generateAnalysis()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary Tindak Lanjut</h2>
            <div className="space-y-3">
              {generateRecommendations().split('\n').map((rec, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{rec.substring(rec.indexOf('.') + 2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RespondentDetail;
