import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import WeeklyPlanning from './WeeklyPlanning';
import './weekly.css';

const menu = [
  ['🏠', 'لوحة التحكم'],
  ['📚', 'إعداد الدروس'],
  ['📝', 'خطة سنوية'],
  ['📅', 'التخطيط الأسبوعي'],
  ['📋', 'التحضير اليومي'],
  ['📖', 'الموارد التعليمية'],
  ['📊', 'التقويم والمتابعة'],
];

function Dashboard({ setActive }) {
  return (
    <>
      <section className="hero">
        <div>
          <h1>أهلاً بك في سند الأستاذ 👋</h1>
          <p>نظّم عملك التربوي، حضّر دروسك، وأنشئ خططك التعليمية بسهولة.</p>
        </div>
        <div className="hero-icon">🎓</div>
      </section>

      <div className="section-title">
        <h2>نظرة عامة</h2>
        <span>ملخص عملك التربوي</span>
      </div>

      <div className="cards">
        <div className="card">
          <div className="stat-icon">📚</div>
          <strong>0</strong>
          <small>الدروس المحضّرة</small>
        </div>

        <div className="card">
          <div className="stat-icon">📅</div>
          <strong>0</strong>
          <small>الخطط الأسبوعية</small>
        </div>

        <div className="card">
          <div className="stat-icon">📝</div>
          <strong>0</strong>
          <small>التحضيرات اليومية</small>
        </div>

        <div className="card">
          <div className="stat-icon">📊</div>
          <strong>0</strong>
          <small>أنشطة المتابعة</small>
        </div>
      </div>

      <div className="section-title">
        <h2>ابدأ العمل</h2>
        <span>اختر المهمة التي تريد تنفيذها</span>
      </div>

      <div className="actions">
        <div className="action">
          <div className="action-icon">📚</div>
          <h3>إعداد درس جديد</h3>
          <p>أنشئ تحضيرًا منظمًا للدرس خطوة بخطوة.</p>
          <button className="start" onClick={() => setActive('إعداد الدروس')}>
            ابدأ الآن
          </button>
        </div>

        <div className="action">
          <div className="action-icon">🗓️</div>
          <h3>إنشاء خطة سنوية</h3>
          <p>نظّم البرنامج السنوي والوحدات والدروس.</p>
          <button className="start" onClick={() => setActive('خطة سنوية')}>
            إنشاء الخطة
          </button>
        </div>

        <div className="action">
          <div className="action-icon">📋</div>
          <h3>التخطيط الأسبوعي</h3>
          <p>رتّب حصصك وأهدافك وأنشطتك خلال الأسبوع.</p>
          <button className="start" onClick={() => setActive('التخطيط الأسبوعي')}>
            ابدأ التخطيط
          </button>
        </div>
      </div>
    </>
  );
}

function LessonForm() {
  const [form, setForm] = useState({
    subject: '',
    level: '',
    year: '',
    unit: '',
    title: '',
    competency: '',
    objectives: '',
    duration: '60 دقيقة',
    assessment: '',
    notes: ''
  });

  const [saved, setSaved] = useState(false);

  function update(field, value) {
    setForm({ ...form, [field]: value });
    setSaved(false);
  }

  function createLesson(e) {
    e.preventDefault();

    if (!form.subject || !form.level || !form.title) {
      alert('يرجى إدخال المادة والمستوى وعنوان الدرس.');
      return;
    }

    localStorage.setItem('sandiLesson', JSON.stringify(form));
    setSaved(true);
  }

  return (
    <div className="lesson-page">

      <div className="page-heading">
        <div>
          <h1>📚 إعداد درس جديد</h1>
          <p>أدخل معلومات الدرس لإنشاء تحضير منظم.</p>
        </div>
      </div>

      {saved && (
        <div className="success-message">
          ✅ تم حفظ بيانات التحضير بنجاح على هذا الجهاز.
        </div>
      )}

      <form onSubmit={createLesson}>

        <div className="form-section">
          <h2>المعلومات الأساسية</h2>

          <div className="form-grid">

            <label>
              المادة
              <select
                value={form.subject}
                onChange={e => update('subject', e.target.value)}
              >
                <option value="">اختر المادة</option>
                <option>الرياضيات</option>
                <option>اللغة العربية</option>
                <option>اللغة الفرنسية</option>
                <option>اللغة الإنجليزية</option>
                <option>العلوم الطبيعية</option>
                <option>الفيزياء</option>
                <option>التاريخ والجغرافيا</option>
              </select>
            </label>

            <label>
              المستوى الدراسي
              <select
                value={form.level}
                onChange={e => update('level', e.target.value)}
              >
                <option value="">اختر المستوى</option>
                <option>الأولى ابتدائي</option>
                <option>الثانية ابتدائي</option>
                <option>الثالثة ابتدائي</option>
                <option>الرابعة ابتدائي</option>
                <option>الخامسة ابتدائي</option>
                <option>الأولى متوسط</option>
                <option>الثانية متوسط</option>
                <option>الثالثة متوسط</option>
                <option>الرابعة متوسط</option>
              </select>
            </label>

            <label>
              السنة الدراسية
              <input
                value={form.year}
                onChange={e => update('year', e.target.value)}
                placeholder="مثال: 2026/2027"
              />
            </label>

            <label>
              الوحدة التعليمية
              <input
                value={form.unit}
                onChange={e => update('unit', e.target.value)}
                placeholder="اسم الوحدة"
              />
            </label>

          </div>
        </div>

        <div className="form-section">
          <h2>محتوى الدرس</h2>

          <label>
            عنوان الدرس *
            <input
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder="اكتب عنوان الدرس"
            />
          </label>

          <label>
            الكفاءة المستهدفة
            <textarea
              value={form.competency}
              onChange={e => update('competency', e.target.value)}
              placeholder="اكتب الكفاءة المستهدفة..."
            />
          </label>

          <label>
            الأهداف التعليمية
            <textarea
              value={form.objectives}
              onChange={e => update('objectives', e.target.value)}
              placeholder="اكتب الأهداف التعليمية..."
            />
          </label>
        </div>

        <div className="form-section">
          <h2>تنظيم الحصة</h2>

          <div className="form-grid">

            <label>
              مدة الحصة
              <select
                value={form.duration}
                onChange={e => update('duration', e.target.value)}
              >
                <option>45 دقيقة</option>
                <option>60 دقيقة</option>
                <option>90 دقيقة</option>
                <option>120 دقيقة</option>
              </select>
            </label>

            <label>
              التقويم
              <input
                value={form.assessment}
                onChange={e => update('assessment', e.target.value)}
                placeholder="طريقة تقويم المتعلمين"
              />
            </label>

          </div>

          <label>
            ملاحظات الأستاذ
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="أضف ملاحظاتك هنا..."
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            💾 حفظ التحضير
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setForm({
                subject: '',
                level: '',
                year: '',
                unit: '',
                title: '',
                competency: '',
                objectives: '',
                duration: '60 دقيقة',
                assessment: '',
                notes: ''
              });
              setSaved(false);
            }}
          >
            🔄 مسح النموذج
          </button>
        </div>

      </form>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon">🚧</div>
      <h1>{title}</h1>
      <p>هذا القسم قيد التطوير وسنضيف وظائفه في الخطوات القادمة.</p>
    </div>
  );
}

function App() {
  const [active, setActive] = useState('لوحة التحكم');

  function renderContent() {
    if (active === 'لوحة التحكم') {
      return <Dashboard setActive={setActive} />;
    }
if (active === 'التخطيط الأسبوعي') {
  return <WeeklyPlanning />;
}

    if (active === 'إعداد الدروس') {
      return <LessonForm />;
    }

    return <Placeholder title={active} />;
  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">📚</div>
          <h2>منصة سند الأستاذ</h2>
          <span>رفيقك في العمل التربوي</span>
        </div>

        {menu.map(([icon, label]) => (
          <button
            key={label}
            className={`menu-item ${active === label ? 'active' : ''}`}
            onClick={() => setActive(label)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}

      </aside>

      <main className="main">

        <header className="topbar">
          <div>
            <div className="welcome">مرحبًا بك في منصة سند الأستاذ</div>
            <div className="teacher">{active}</div>
          </div>

          <div className="avatar">👨‍🏫</div>
        </header>

        <div className="content">
          {renderContent()}
          <div className="footer-note">
            منصة سند الأستاذ — الإصدار الأول
          </div>
        </div>

      </main>

    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
