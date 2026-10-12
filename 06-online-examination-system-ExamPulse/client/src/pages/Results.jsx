import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import ScoreRing from '../components/ScoreRing';
import TopicBar from '../components/TopicBar';

export default function Results() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [review, setReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/attempts/${attemptId}`)
      .then((res) => {
        setAttempt(res.data.attempt);
        setReview(res.data.review);
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load these results.'))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <div style={{ padding: 24, fontSize: 13 }}>Loading results…</div>;
  if (error) return <div className="error-text" style={{ padding: 24 }}>{error}</div>;

  const percent = attempt.totalMarks ? Math.round((attempt.score / attempt.totalMarks) * 100) : 0;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 28 }}>
        <div
          style={{
            width: 160,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <ScoreRing percent={percent} />
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
            {attempt.score} / {attempt.totalMarks} marks
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-green-dark)' }}>{attempt.correctCount}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>correct</div>
            </div>
            <div style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-red-dark)' }}>{attempt.incorrectCount}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>incorrect</div>
            </div>
            <div style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 500, color: 'var(--color-amber-dark)' }}>{attempt.skippedCount}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>skipped</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Topic performance</div>
          {attempt.topicBreakdown.map((t) => (
            <TopicBar key={t.topic} topic={t.topic} correct={t.correct} total={t.total} />
          ))}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>Question review</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {review.map((r, i) => (
          <div
            key={i}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#fff',
                background: r.isCorrect ? 'var(--color-green)' : 'var(--color-red)',
              }}
            >
              {r.isCorrect ? '✓' : '✕'}
            </span>
            <div>
              <div style={{ fontSize: 13 }}>{r.question}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Your answer: {r.selectedOption || 'skipped'} · Correct: {r.correctOption}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}