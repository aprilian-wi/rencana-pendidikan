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

  // Generate insight analysis for sales approach
  const generateInsightAnalysis = () => {
    const responses = respondent.responses;
    let insights = [];

    // Analyze financial awareness and readiness
    const q1Response = responses.find(r => r.questionNumber === 1)?.answer[0];
    const q4Response = responses.find(r => r.questionNumber === 4)?.answer[0];
    const q7Response = responses.find(r => r.numberNumber === 7)?.answer[0];

    let financialProfile = '';
    if (q4Response === 'Sudah ada dan rutin dijalankan' && q7Response?.includes('Di atas Rp 500.000')) {
      financialProfile = 'Prospek memiliki kesadaran finansial tinggi dan kemampuan alokasi dana yang baik.';
    } else if (q4Response === 'Sudah ada, tapi belum konsisten') {
      financialProfile = 'Prospek memiliki kesadaran finansial namun membutuhkan panduan untuk konsistensi.';
    } else {
      financialProfile = 'Prospek membutuhkan edukasi tentang pentingnya perencanaan keuangan pendidikan.';
    }
    insights.push(financialProfile);

    // Analyze pain points and motivation
    const q5Response = responses.find(r => r.questionNumber === 5)?.answer;
    let painPoints = 'Area kekhawatiran utama: ';
    if (q5Response?.includes('Biaya yang makin naik')) {
      painPoints += 'kenaikan biaya pendidikan di masa depan';
    } else if (q5Response?.includes('Takut tiba-tiba tidak siap')) {
      painPoints += 'ketidaksiapan finansial mendadak';
    } else if (q5Response?.includes('Tidak tahu harus mulai dari mana')) {
      painPoints += 'kebingungan memulai perencanaan';
    }
    insights.push(painPoints);

    // Analyze product awareness and interest
    const q8Response = responses.find(r => r.questionNumber === 8)?.answer[0];
    const q10Response = responses.find(r => r.questionNumber === 10)?.answer[0];
    let productAwareness = '';
    if (q10Response === 'Belum pernah sama sekali') {
      productAwareness = 'Prospek belum memiliki pengalaman dengan asuransi pendidikan - membutuhkan edukasi dasar tentang manfaat produk.';
    } else if (q10Response === 'Pernah punya, tapi sudah tidak lanjut') {
      productAwareness = 'Prospek memiliki pengalaman kurang baik dengan asuransi pendidikan - perlu digali alasan penghentian dan ditawarkan diferensiasi produk syariah.';
    } else if (q10Response === 'Tahu tentang asuransi pendidikan, tapi belum minat') {
      productAwareness = 'Prospek memiliki resistensi terhadap asuransi pendidikan - perlu pendekatan dengan fokus pada nilai tambah produk syariah.';
    }
    insights.push(productAwareness);

    // Analyze urgency and timing
    const q9Response = responses.find(r => r.questionNumber === 9)?.answer[0];
    let urgencyLevel = '';
    if (q9Response?.includes('Mulai sekarang')) {
      urgencyLevel = 'Prospek memiliki urgensi tinggi - cocok untuk pendekatan closing yang lebih cepat.';
    } else if (q9Response?.includes('Nanti saja')) {
      urgencyLevel = 'Prospek belum melihat urgensi - perlu edukasi tentang manfaat persiapan dini.';
    }
    insights.push(urgencyLevel);

    return insights.join('\n\n');
  };

  // Generate sales approach recommendations
  const generateApproachRecommendations = () => {
    const responses = respondent.responses;
    let recommendations = [];

    // Determine communication preference
    const q11Response = responses.find(r => r.questionNumber === 11)?.answer[0];
    let approachMethod = '';
    if (q11Response?.includes('chat')) {
      approachMethod = '1. Pendekatan melalui chat - mulai dengan sharing konten edukatif tentang perencanaan keuangan syariah sebelum masuk ke produk.';
    } else if (q11Response?.includes('ketemu')) {
      approachMethod = '1. Pendekatan melalui meeting langsung - siapkan presentasi visual tentang proyeksi biaya pendidikan dan solusi syariah.';
    }
    recommendations.push(approachMethod);

    // Determine education focus
    const q5Response = responses.find(r => r.questionNumber === 5)?.answer;
    const q6Response = responses.find(r => r.questionNumber === 6)?.answer[0];
    let educationFocus = '2. Fokus edukasi pada: ';
    if (q5Response?.includes('Biaya yang makin naik')) {
      educationFocus += 'proyeksi kenaikan biaya pendidikan dan bagaimana produk syariah bisa mengatasinya';
    } else if (q6Response?.includes('Mencari produk keuangan')) {
      educationFocus += 'diferensiasi dan keunggulan produk syariah dibanding konvensional';
    } else {
      educationFocus += 'dasar-dasar perencanaan keuangan syariah untuk pendidikan';
    }
    recommendations.push(educationFocus);

    // Product presentation strategy
    const q8Response = responses.find(r => r.questionNumber === 8)?.answer[0];
    const q10Response = responses.find(r => r.numberNumber === 10)?.answer[0];
    let presentationStrategy = '3. Strategi presentasi produk: ';
    if (q10Response === 'Pernah punya, tapi sudah tidak lanjut') {
      presentationStrategy += 'fokus pada diferensiasi dan keunggulan sistem syariah, serta fitur yang mengatasi masalah di produk sebelumnya';
    } else if (q8Response === 'Iya, sangat tertarik') {
      presentationStrategy += 'langsung ke detail produk dan simulasi manfaat yang konkret';
    } else {
      presentationStrategy += 'mulai dari edukasi dasar tentang pentingnya asuransi pendidikan syariah';
    }
    recommendations.push(presentationStrategy);

    // Closing strategy
    const q4Response = responses.find(r => r.numberNumber === 4)?.answer[0];
    const q7Response = responses.find(r => r.numberNumber === 7)?.answer[0];
    let closingStrategy = '4. Strategi closing: ';
    if (q4Response === 'Sudah ada dan rutin dijalankan' && q7Response?.includes('Di atas')) {
      closingStrategy += 'tawarkan paket premium dengan manfaat maksimal';
    } else if (q7Response?.includes('Di bawah') || q7Response?.includes('100.000')) {
      closingStrategy += 'mulai dari paket dasar dengan kontribusi terjangkau';
    } else {
      closingStrategy += 'fokus pada fleksibilitas kontribusi dan manfaat yang bisa disesuaikan';
    }
    recommendations.push(closingStrategy);

    return recommendations.join('\n\n');
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
              {generateInsightAnalysis().split('\n\n').map((insight, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <p className="text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary Tindak Lanjut</h2>
            <div className="space-y-6">
              {generateApproachRecommendations().split('\n\n').map((rec, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-700 leading-relaxed">{rec.substring(rec.indexOf('.') + 2)}</p>
                  </div>
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
