export default function Avatar({ initials, className = '', size = '' }) {
  return (
    <span className={`avatar ${className} ${size}`} aria-hidden="true">
      {initials}
    </span>
  );
}
