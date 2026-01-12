import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>404 - Página No Encontrada</h1>
            <p>Lo sentimos, no pudimos encontrar la página que buscas.</p>
            <Link href="/" style={{ color: 'blue', textDecoration: 'underline' }}>
                Volver al inicio
            </Link>
        </div>
    );
}