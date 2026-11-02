import Link from "next/link";

export default function NotFound() {
  return (
    <div className="article">
      <h1 className="page-title">Siden findes ikke</h1>
      <p>Den side, du leder efter, er flyttet eller findes ikke.</p>
      <p>
        <Link href="/" className="btn btn-red">Til forsiden</Link>
      </p>
    </div>
  );
}
