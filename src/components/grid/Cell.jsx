export default function Cell({ value, status, delay = 0, celebrate = false }) {
  const statusColorClasses = {
    correct: 'cell-correct',
    present: 'cell-present',
    absent: 'cell-absent',
  };

  const colorClass = status ? statusColorClasses[status] : 'cell-default';
  const animClass = status ? 'cell-flip' : 'cell-pop';
  const style = status
    ? { animationDelay: celebrate ? `${delay}ms, ${delay + 500}ms` : `${delay}ms` }
    : undefined;

  return (
    <div
      className={`cell-base ${colorClass} ${animClass} ${celebrate ? 'cell-bounce' : ''}`}
      style={style}
    >
      {value}
    </div>
  );
}