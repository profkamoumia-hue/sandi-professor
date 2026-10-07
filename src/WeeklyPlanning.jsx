import React, { useState } from 'react';

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

const emptySession = () => ({
  time: '',
  lesson: '',
  objective: '',
  activity: '',
  room: '',
});

const createDefaultPlan = () =>
  Object.fromEntries(
    DAYS.map((day) => [
      day,
      Array.from({ length: 6 }, () => emptySession()),
    ])
  );

export default function WeeklyPlanning() {
  const [meta, setMeta] = useState(() => {
    const saved = localStorage.getItem('sandiWeeklyMeta');
    return saved
      ? JSON.parse(saved)
      : {
          year: '2026/2027',
          week: '',
          subject: '',
          level: '',
          teacher: '',
          school: '',
        };
  });

  const [plan, setPlan] = useState(() => {
    const saved = localStorage.getItem('sandiWeeklyPlan');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure every day has exactly six session slots.
      return Object.fromEntries(
        DAYS.map((day) => [
          day,
          Array.from({ length: 6 }, (_, i) => parsed?.[day]?.[i] || emptySession()),
        ])
      );
    }
    return createDefaultPlan();
  });

  const [saved, setSaved] = useState(false);

  const updateMeta = (field, value) => {
    setMeta((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateSession = (day, index, field, value) => {
    setPlan((prev) => ({
      ...prev,
      [day]: prev[day].map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      ),
    }));
    setSaved(false);
  };

  const savePlan = () => {
    localStorage.setItem('sandiWeeklyMeta', JSON.stringify(meta));
    localStorage.setItem('sandiWeeklyPlan', JSON.stringify(plan));
    setSaved(true);
  };

  const resetPlan = () => {
    if (!window.confirm('هل تريد مسح التخطيط الأسبوعي بالكامل؟')) return;
    const fresh = createDefaultPlan();
    setPlan(fresh);
    setMeta({
      year: '2026/2027',
      week: '',
      subject: '',
      level: '',
      teacher: '',
      school: '',
    });
    localStorage.removeItem('sandiWeeklyMeta');
    localStorage.removeItem('sandiWeeklyPlan');
    setSaved(false);
  };

  const printPlan = () => {
    window.print();
  };

  return (
    <div className="weekly-page" dir="rtl">
      <div className="page-heading weekly-heading no-print">
        <div>
          <h1>📅 التخطيط الأسبوعي</h1>
          <p>نظّم حصصك وأهدافك وأنشطتك خلال أيام الأسبوع في مكان واحد.</p>
        </div>

        <div className="weekly-actions">
          <button className="secondary-button" onClick={resetPlan}>🗑 مسح</button>
          <button className="secondary-button" onClick={printPlan}>🖨 طباعة</button>
          <button className="primary-button" onClick={savePlan}>💾 حفظ الخطة</button>
        </div>
      </div>

      {saved && (
        <div className="success-message no-print">
          ☑ تم حفظ التخطيط الأسبوعي على هذا الجهاز
        </div>
      )}

      <div className="form-section weekly-meta no-print">
        <h2>بيانات الأسبوع</h2>

        <div className="weekly-meta-grid">
          <label>
            السنة الدراسية
            <input value={meta.year} onChange={(e) => updateMeta('year', e.target.value)} />
          </label>

          <label>
            الأسبوع
            <input
              placeholder="مثال: الأسبوع 01"
              value={meta.week}
              onChange={(e) => updateMeta('week', e.target.value)}
            />
          </label>

          <label>
            المادة
            <input
              placeholder="مثال: الرياضيات"
              value={meta.subject}
              onChange={(e) => updateMeta('subject', e.target.value)}
            />
          </label>

          <label>
            المستوى
            <input
              placeholder="مثال: الرابعة متوسط"
              value={meta.level}
              onChange={(e) => updateMeta('level', e.target.value)}
            />
          </label>

          <label>
            الأستاذ
            <input
              placeholder="اسم الأستاذ"
              value={meta.teacher}
              onChange={(e) => updateMeta('teacher', e.target.value)}
            />
          </label>

          <label>
            المؤسسة
            <input
              placeholder="اسم المؤسسة"
              value={meta.school}
              onChange={(e) => updateMeta('school', e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="weekly-summary no-print">
        <div><strong>5</strong><span>أيام دراسية</span></div>
        <div><strong>30</strong><span>حصة في الأسبوع</span></div>
        <div>
          <strong>
            {DAYS.reduce(
              (total, day) =>
                total +
                plan[day].filter((s) => s.lesson || s.objective || s.activity || s.time || s.room).length,
              0
            )}
          </strong>
          <span>حصص مبرمجة</span>
        </div>
      </div>

      <div className="weekly-grid no-print">
        {DAYS.map((day) => (
          <section className="day-card" key={day}>
            <div className="day-header">
              <h2>{day}</h2>
              <span>6 حصص</span>
            </div>

            {plan[day].map((session, index) => (
              <div className="session-card" key={index}>
                <div className="session-title">
                  <strong>الحصة {index + 1}</strong>
                </div>

                <div className="session-fields">
                  <label>
                    التوقيت
                    <input
                      value={session.time}
                      placeholder="08:00 - 09:00"
                      onChange={(e) => updateSession(day, index, 'time', e.target.value)}
                    />
                  </label>

                  <label>
                    الدرس / النشاط
                    <input
                      value={session.lesson}
                      placeholder="عنوان الدرس"
                      onChange={(e) => updateSession(day, index, 'lesson', e.target.value)}
                    />
                  </label>

                  <label>
                    الهدف
                    <input
                      value={session.objective}
                      placeholder="الهدف التعلمي"
                      onChange={(e) => updateSession(day, index, 'objective', e.target.value)}
                    />
                  </label>

                  <label>
                    النشاط / التقويم
                    <input
                      value={session.activity}
                      placeholder="تمرين، نشاط، تقويم..."
                      onChange={(e) => updateSession(day, index, 'activity', e.target.value)}
                    />
                  </label>

                  <label>
                    القسم
                    <input
                      value={session.room}
                      placeholder="القسم"
                      onChange={(e) => updateSession(day, index, 'room', e.target.value)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* نسخة خاصة بالطباعة: جدول واحد، وكل يوم يليه حصصه ثم اليوم الموالي */}
      <div className="weekly-print-area">
        <div className="print-header">
          <h1>التخطيط الأسبوعي</h1>
          <div className="print-meta">
            <span><b>السنة:</b> {meta.year || '................'}</span>
            <span><b>الأسبوع:</b> {meta.week || '................'}</span>
            <span><b>المادة:</b> {meta.subject || '................'}</span>
            <span><b>المستوى:</b> {meta.level || '................'}</span>
            <span><b>الأستاذ:</b> {meta.teacher || '................'}</span>
            <span><b>المؤسسة:</b> {meta.school || '................'}</span>
          </div>
        </div>

        <table className="weekly-print-table">
          <thead>
            <tr>
              <th>اليوم</th>
              <th>الحصة</th>
              <th>التوقيت</th>
              <th>الدرس / النشاط</th>
              <th>الهدف التعلمي</th>
              <th>النشاط / التقويم</th>
              <th>القسم</th>
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day) =>
              plan[day].map((session, index) => (
                <tr key={`${day}-${index}`}>
                  {index === 0 && (
                    <td className="print-day" rowSpan={6}>
                      {day}
                    </td>
                  )}
                  <td>{index + 1}</td>
                  <td>{session.time || ''}</td>
                  <td>{session.lesson || ''}</td>
                  <td>{session.objective || ''}</td>
                  <td>{session.activity || ''}</td>
                  <td>{session.room || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="print-footer">
          <span>إمضاء الأستاذ: ............................</span>
          <span>إمضاء الإدارة: ............................</span>
        </div>
      </div>
    </div>
  );
}
