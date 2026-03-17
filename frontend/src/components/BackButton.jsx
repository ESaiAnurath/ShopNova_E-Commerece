import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(-1)}>
      <span className="back-arrow">←</span>
      <span className="back-text">Back</span>

      <style>{`
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.7);
          padding: 8px 16px;
          border-radius: 10px;
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .back-btn:hover {
          background: rgba(108,99,255,0.15);
          border-color: #6C63FF;
          color: #a099ff;
          transform: translateX(-2px);
        }
        .back-arrow {
          font-size: 16px;
          transition: transform 0.2s;
        }
        .back-btn:hover .back-arrow {
          transform: translateX(-3px);
        }
      `}</style>
    </button>
  );
}
