import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    number: 1,
    text: 'Apa yang pertama kali terlintas di pikiran Ayah Bunda saat mendengar kata “masa depan anak”?',
    options: [
      'Pendidikan',
      'Karier',
      'Biaya',
      'Kebahagiaan',
      'Ketenangan hati',
    ],
    multiple: false,
  },
  {
    number: 2,
    text: 'Ayah Bunda sudah pernah membayangkan anak nanti akan kuliah di mana atau jadi apa?',
    options: [
      'Sudah, cukup jelas',
      'Sering terbayang, tapi belum spesifik',
      'Belum kepikiran sama sekali',
    ],
    multiple: false,
  },
  {
    number: 3,
    text: 'Menurut Ayah Bunda, bagaimana kondisi biaya pendidikan 10 tahun ke depan?',
    options: [
      'Jauh lebih mahal',
      'Sedikit lebih mahal',
      'Kurang lebih sama',
      'Tidak tahu',
    ],
    multiple: false,
  },
  {
    number: 4,
    text: 'Saat ini, bagaimana kondisi perencanaan dana pendidikan anak di keluarga Ayah Bunda?',
    options: [
      'Sudah ada dan rutin dijalankan',
      'Sudah ada, tapi belum konsisten',
      'Ada niat, tapi belum mulai',
      'Belum ada sama sekali',
    ],
    multiple: false,
  },
  {
    number: 5,
    text: 'Apa kekhawatiran terbesar Ayah Bunda soal masa depan pendidikan anak? (Boleh pilih lebih dari satu)',
    options: [
      'Biaya yang makin naik',
      'Tidak tahu harus mulai dari mana',
      'Takut tiba-tiba tidak siap',
      'Belum sempat diskusi dengan pasangan',
      'Tidak ada kekhawatiran',
    ],
    multiple: true,
  },
  {
    number: 6,
    text: 'Menurut Ayah Bunda, langkah terbaik untuk menyiapkan masa depan pendidikan anak adalah...',
    options: [
      'Menabung sejak dini',
      'Mencari produk keuangan yang sesuai',
      'Meningkatkan penghasilan',
      'Mendapat edukasi soal strategi perencanaan',
      'Belum tahu',
    ],
    multiple: false,
  },
  {
    number: 7,
    text: 'Setiap bulan, kira-kira Ayah Bunda bisa menyisihkan dana berapa untuk rencana pendidikan anak?',
    options: [
      'Di bawah Rp 100.000',
      'Rp 100.000 – Rp 250.000',
      'Rp 250.000 – Rp 500.000',
      'Di atas Rp 500.000',
      'Belum tahu / belum bisa menyisihkan',
    ],
    multiple: false,
  },
  {
    number: 8,
    text: 'Jika ada solusi syariah yang bisa bantu Ayah Bunda menyiapkan biaya pendidikan anak secara bertahap dan aman, apakah tertarik untuk tahu lebih lanjut?',
    options: [
      'Iya, sangat tertarik',
      'Tertarik, tapi ingin pelajari dulu',
      'Tidak tertarik dulu',
    ],
    multiple: false,
  },
  {
    number: 9,
    text: 'Menurut Ayah Bunda, berapa lama idealnya dana pendidikan anak perlu disiapkan sejak sekarang?',
    options: [
      'Mulai sekarang, selagi anak masih SD',
      'Nanti saja saat anak masuk SMP/SMA',
      'Tidak yakin / Belum tau',
    ],
    multiple: false,
  },
  {
    number: 10,
    text: 'Apakah Ayah Bunda pernah tahu atau pernah punya asuransi pendidikan sebelumnya?',
    options: [
      'Pernah punya, sekarang masih aktif',
      'Pernah punya, tapi sudah tidak lanjut',
      'Belum pernah sama sekali',
      'Tahu tentang asuransi pendidikan, tapi belum minat',
    ],
    multiple: false,
  },
  {
    number: 11,
    text: 'Jika setelah ini ada materi tambahan atau penjelasan langsung dari saya seputar solusi persiapan pendidikan anak secara syariah, Ayah Bunda lebih nyaman:',
    options: [
      'Diskusi santai dulu via chat',
      'Langsung ketemu dan konsultasi',
      'Tidak perlu, terima kasih',
    ],
    multiple: false,
  },
];

const SurveyForm = () => {
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const handleOptionChange = (questionNumber, option) => {
    setAnswers((prev) => {
      const prevAnswers = prev[questionNumber] || [];
      if (questions.find(q => q.number === questionNumber).multiple) {
        // Multiple choice
        if (prevAnswers.includes(option)) {
          return { ...prev, [questionNumber]: prevAnswers.filter(a => a !== option) };
        } else {
          return { ...prev, [questionNumber]: [...prevAnswers, option] };
        }
      } else {
        // Single choice
        return { ...prev, [questionNumber]: [option] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!parentName || !childName || !phone) {
      alert('Mohon lengkapi data Nama Orang tua, Nama Anak, dan No Hp.');
      return;
    }

    // Validate all questions answered
    for (const q of questions) {
      if (!answers[q.number] || answers[q.number].length === 0) {
        alert(`Mohon jawab pertanyaan nomor ${q.number}`);
        return;
      }
    }

    // Prepare data for API
    const responses = Object.entries(answers).map(([questionNumber, answer]) => ({
      questionNumber: parseInt(questionNumber),
      answer,
    }));

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName,
          childName,
          phone,
          responses,
        }),
      });
      if (res.ok) {
        alert('Survey berhasil dikirim. Terima kasih!');
        navigate('/dashboard');
      } else {
        alert('Gagal mengirim survey. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim survey.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Form Survey</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-1">Nama lengkap Ayah/Bunda</label>
          <input
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Nama lengkap Putra/i</label>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">No Hp</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {questions.map((q) => (
          <div key={q.number}>
            <p className="font-semibold mb-2">{q.number}. {q.text}</p>
            <div className="space-y-1">
              {q.options.map((option) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type={q.multiple ? 'checkbox' : 'radio'}
                    name={`question-${q.number}`}
                    value={option}
                    checked={answers[q.number]?.includes(option) || false}
                    onChange={() => handleOptionChange(q.number, option)}
                    required={!q.multiple}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Kirim Survey
        </button>
      </form>
    </div>
  );
};

export default SurveyForm;
