export default function Cell({ value, status }) {
  const statusClasses = {
    correct: 'cell-correct',
    present: 'cell-present',
    absent: 'cell-absent',
    default: 'cell-default'
  };

  const appliedClass = status ? statusClasses[status] : statusClasses.default;

  return (
    <div className={`cell-base ${appliedClass}`}>
      {value}
    </div>
  );
}