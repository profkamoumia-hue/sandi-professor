import React, { useState } from 'react';

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const emptySession = () => ({
  time: '',
  lesson: '',
  objective: '',
  activity: '',
  room: ''
});

export default function WeeklyPlanning() {
  const [meta, setMeta] = useState(() => {
    const saved = localStorage.getItem('sandiWeeklyMeta');
    return saved ? JSON.parse(saved) : {
      year: '2026/2027',
      week: '',
      subject: '',
      level: '',
      teacher: '',
      school: ''
    };
  });

  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('sandiWeeklyPlan');
    return saved
      ? JSON.parse(saved)
      : Object.fromEntries(DAYS.map(day => [
          day,
          [
  emptySession(),
  emptySession(),
  emptySession(),
  emptySession(),
  emptySession(),
  emptySession()
]
        ]));
  });

  const [saved, setSaved] = useState(false);

  const updateMeta = (field, value) => {
    setMeta(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateSession = (day, index, field, value) => {
    setPlan(prev => ({
      ...prev,
      [day]: prev[day].map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      )
    }));
    setSaved(false);
  };

  const addSession = day => {
    setPlan(prev => ({
      ...prev,
      [day]: [...prev[day], emptySession()]
    }));
  };

  const removeSession = (day, index) => {
    setPlan(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const savePlan = () => {
    localStorage.setItem('sandiWeeklyMeta', JSON.stringify(meta));
    localStorage.setItem('sandiWeeklyPlan', JSON.stringify(plan));
    setSaved(true);
  };

  const resetPlan = () => {
    if (!window.confirm('هل تريد مسح التخطيط الأسبوعي الحالي؟')) return;
    const blank = Object.fromEntries(
      DAYS.map(day => [day, [emptySession(), emptySession(), emptySession()]])
    );
    setPlan(blank);
    setMeta({
      year: '2026/2027',
      week: '',
      subject: '',
      level: '',
      teacher: '',
      school: ''
    });
    localStorage.removeItem('sandiWeeklyMeta');
    localStorage.removeItem('sandiWeeklyPlan');
    setSaved(false);
  };

  return (
    <div className="weekly-page">
      <div className="page-heading weekly-heading">
        <div>
          <h1>📅 التخطيط الأسبوعي</h1>
          <p>نظّم حصصك وأهدافك وأنشطتك خلال أيام الأسبوع في مكان واحد.</p>
        </div>

        <div className="weekly-actions">
          <button className="secondary-button" onClick={resetPlan}>🔄 مسح</button>
          <button className="secondary-button" onClick={() => window.print()}>🖨️ طباعة</button>
          <button className="primary-button" onClick={savePlan}>💾 حفظ الخطة</button>
        </div>
      </div>

      {saved && (
        <div className="success-message">
          ✅ تم حفظ التخطيط الأسبوعي على هذا الجهاز.
        </div>
      )}

      <div className="form-section weekly-meta">
        <h2>بيانات الأسبوع</h2>

        <div className="weekly-meta-grid">
          <label>
            السنة الدراسية
            <input value={meta.year} onChange={e => updateMeta('year', e.target.value)} />
          </label>

          <label>
            الأسبوع
            <input
              value={meta.week}
              onChange={e => updateMeta('week', e.target.value)}
              placeholder="مثال: الأسبوع 04"
            />
          </label>

          <label>
            المادة
            <select value={meta.subject} onChange={e => updateMeta('subject', e.target.value)}>
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
            المستوى
            <select value={meta.level} onChange={e => updateMeta('level', e.target.value)}>
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
            اسم الأستاذ
            <input
              value={meta.teacher}
              onChange={e => updateMeta('teacher', e.target.value)}
              placeholder="اسم الأستاذ"
            />
          </label>

          <label>
            المؤسسة
            <input
              value={meta.school}
              onChange={e => updateMeta('school', e.target.value)}
              placeholder="اسم المؤسسة"
            />
          </label>
        </div>
      </div>

      <div className="weekly-summary">
        <div><strong>5</strong><span>أيام الدراسة</span></div>
        <div>
          <strong>{DAYS.reduce((n, day) => n + plan[day].length, 0)}</strong>
          <span>خانات الحصص</span>
        </div>
        <div>
          <strong>
            {DAYS.reduce(
              (n, day) => n + plan[day].filter(s => s.lesson.trim()).length,
              0
            )}
          </strong>
          <span>حصص مبرمجة</span>
        </div>
      </div>

      <div className="weekly-grid">
        {DAYS.map(day => (
          <section className="day-card" key={day}>
            <div className="day-header">
              <div>
                <span>📅</span>
                <h2>{day}</h2>
              </div>
              <button className="add-session" onClick={() => addSession(day)}>
                ＋ حصة
              </button>
            </div>

            <div className="sessions">
              {plan[day].map((session, index) => (
                <div className="session-card" key={index}>
                  <div className="session-top">
                    <span>الحصة {index + 1}</span>

                    {plan[day].length > 1 && (
                      <button
                        className="remove-session"
                        onClick={() => removeSession(day, index)}
                        title="حذف الحصة"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="session-fields">
                    <label>
                      التوقيت
                      <input
                        value={session.time}
                        onChange={e => updateSession(day, index, 'time', e.target.value)}
                        placeholder="08:00 - 09:00"
                      />
                    </label>

                    <label>
                      الدرس / النشاط
                      <input
                        value={session.lesson}
                        onChange={e => updateSession(day, index, 'lesson', e.target.value)}
                        placeholder="عنوان الدرس"
                      />
                    </label>

                    <label>
                      الهدف
                      <input
                        value={session.objective}
                        onChange={e => updateSession(day, index, 'objective', e.target.value)}
                        placeholder="الهدف التعلمي"
                      />
                    </label>

                    <label>
                      النشاط / التقويم
                      <input
                        value={session.activity}
                        onChange={e => updateSession(day, index, 'activity', e.target.value)}
                        placeholder="تمرين، نشاط، تقويم..."
                      />
                    </label>

                    <label>
                      القسم
                      <input
                        value={session.room}
                        onChange={e => updateSession(day, index, 'room', e.target.value)}
                        placeholder="القسم"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="weekly-note">
        💡 أضف أو احذف الحصص حسب جدولك الحقيقي، ثم احفظ الخطة. البيانات تُحفظ على هذا الجهاز ويمكن طباعتها.
      </div>
    </div>
  );
}
