import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Timer from '../components/Timer';

export default function TakeExam() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [attemptId, setAttemptId] = useState(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const viewRes = await api.get(`/exams/${examId}/attempt-view`);
        setExam(viewRes.data.exam);
        setQuestions(viewRes.data.questions);

        let id = viewRes.data.attemptId;
        if (!id) {
          const startRes = await api.post(`/attempts/${examId}/start`);
          id = startRes.data.attemptId;
        }
        setAttemptId(id);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load this exam.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [examId]);

  const handleSubmit = useCallback(async () => {
    if (submitting || !attemptId) return;
    setSubmitting(true);
    try {
      const payload = {
        answers: questions.map((q) => ({
          questionId: q._id,
          selectedOption: answers[q._id] || null,
        })),
      };
      await api.post(`/attempts/${attemptId}/submit`, payload);
      navigate(`/results/${attemptId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your exam.');
      setSubmitting(false);
    }
  }, [attemptId, answers, questions, submitting, navigate]);

  if (loading) return <div style={{ padding: 24, fontSize: 13 }}>Loading exam…</div>;
  if (error) return <div className="error-text" style={{ padding: 24 }}>{error}</div>;
  if (!questions.length) return <div style={{ padding: 24, fontSize: 13 }}>This exam has no questions yet.</div>;

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 2, marginBottom: 12 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--color-indigo)', borderRadius: 2 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
          Question {current + 1} of {questions.length}
        </div>
        <Timer totalSeconds={exam.durationMinutes * 60} onExpire={handleSubmit} />
      </div>

      <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>{q.text}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {q.options.map((opt) => {
          const selected = answers[q._id] === opt.key;
          return (
            <div
              key={opt.key}
              onClick={() => setAnswers((a) => ({ ...a, [q._id]: opt.key }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                border: selected ? '1.5px solid var(--color-indigo)' : '1px solid var(--color-border)',
                background: selected ? 'var(--color-indigo-light)' : 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                fontSize: 14,
                fontWeight: selected ? 500 : 400,
                color: selected ? 'var(--color-indigo-dark)' : 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: selected ? '4px solid var(--color-indigo)' : '1.5px solid var(--color-border)',
                  flexShrink: 0,
                }}
              />
              {opt.text}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          className="btn-primary"
          style={{ background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
        >
          Back
        </button>

        {current < questions.length - 1 ? (
          <button className="btn-primary" onClick={() => setCurrent((c) => c + 1)}>
            Next
          </button>
        ) : (
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit exam'}
          </button>
        )}
      </div>
    </div>
  );
}