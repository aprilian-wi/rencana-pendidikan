import React, { useState } from 'react';

const questions = [
  {
    number: 1,
    text: 'Apa yang pertama kali terlintas di pikiran Ayah Bunda saat mendengar kata "masa depan anak"?',
    options: ['Pendidikan', 'Karier', 'Biaya', 'Kebahagiaan', 'Ketenangan hati'],
    multiple: false,
  },
  {
    number: 2,
    text: 'Ayah Bunda sudah pernah membayangkan anak nanti akan kuliah di mana atau jadi apa?',
    options: [
      'Sudah, cukup jelas',
      'Sering terbayang, tapi belum spesifik',
      'Belum kepikiran sama sekali'
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
      'Tidak tahu'
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
      'Belum ada sama sekali'
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
      'Tidak ada kekhawatiran'
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
      'Belum tahu'
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
      'Belum tahu / belum bisa menyisihkan'
    ],
    multiple: false,
  },
  {
    number: 8,
    text: 'Jika ada solusi syariah yang bisa bantu Ayah Bunda menyiapkan biaya pendidikan anak secara bertahap dan aman, apakah tertarik untuk tahu lebih lanjut?',
    options: [
      'Iya, sangat tertarik',
      'Tertarik, tapi ingin pelajari dulu',
      'Tidak tertarik dulu'
    ],
    multiple: false,
  },
  {
    number: 9,
    text: 'Menurut Ayah Bunda, berapa lama idealnya dana pendidikan anak perlu disiapkan sejak sekarang?',
    options: [
      'Mulai sekarang, selagi anak masih SD',
      'Nanti saja saat anak masuk SMP/SMA',
      'Tidak yakin / Belum tau'
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
      'Tahu tentang asuransi pendidikan, tapi belum minat'
    ],
    multiple: false,
  },
  {
    number: 11,
    text: 'Jika setelah ini ada materi tambahan atau penjelasan langsung dari saya seputar solusi persiapan pendidikan anak secara syariah, Ayah Bunda lebih nyaman:',
    options: [
      'Diskusi santai dulu via chat',
      'Langsung ketemu dan konsultasi',
      'Tidak perlu, terima kasih'
    ],
    multiple: false,
  }
];

const SurveyForm = () => {
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState({});

  const handleOptionChange = (questionNumber, option) => {
    setAnswers((prev) => {
      const prevAnswers = prev[questionNumber] || [];
      if (questions.find(q => q.number === questionNumber).multiple) {
        if (prevAnswers.includes(option)) {
          return { ...prev, [questionNumber]: prevAnswers.filter(a => a !== option) };
        } else {
          return { ...prev, [questionNumber]: [...prevAnswers, option] };
        }
      } else {
        return { ...prev, [questionNumber]: [option] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!parentName || !childName || !phone) {
      alert('Mohon lengkapi data Nama Orang tua, Nama Anak, dan No Hp.');
      return;
    }

    for (const q of questions) {
      if (!answers[q.number] || answers[q.number].length === 0) {
        alert(`Mohon jawab pertanyaan nomor ${q.number}`);
        return;
      }
    }

    const responses = Object.entries(answers).map(([questionNumber, answer]) => ({
      questionNumber: parseInt(questionNumber),
      answer,
    }));

    try {
      const res = await fetch(`https://rencana-pendidikan-api.vercel.app/api/survey`, {
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
        alert('Terima kasih telah mengisi survey! Kami akan menghubungi Anda untuk tindak lanjut.');
        setParentName('');
        setChildName('');
        setPhone('');
        setAnswers({});
        window.scrollTo(0, 0);
      } else {
        alert('Gagal mengirim survey. Silakan coba lagi.');
      }
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim survey.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-8 text-center">
            <p className="text-blue-100">بِسْمِ اللهِ، السَّلامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Survey Perencanaan Pendidikan Anak</h1>
          </div>

          <div className="p-6 md:p-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r">
              <p className="text-blue-700">
              Yuk Ayah & Bunda, isi survei singkat ini. InsyaAllah jadi awal ikhtiar terbaik untuk pendidikan ananda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Data Pribadi</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Nama lengkap Ayah/Bunda</label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">Nama lengkap Putra/i</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700 mb-2">No Hp</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {questions.map((q) => (
                <div key={q.number} className="bg-gray-50 rounded-lg p-6">
                  <p className="font-medium text-gray-800 mb-4 text-lg">{q.number}. {q.text}</p>
                  <div className="space-y-3">
                    {q.options.map((option) => (
                      <label key={option} className="flex items-start space-x-3 p-3 hover:bg-white rounded-lg transition cursor-pointer">
                        <input
                          type={q.multiple ? 'checkbox' : 'radio'}
                          name={`question-${q.number}`}
                          value={option}
                          checked={answers[q.number]?.includes(option) || false}
                          onChange={() => handleOptionChange(q.number, option)}
                          required={!q.multiple}
                          className="mt-1"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Kirim Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
