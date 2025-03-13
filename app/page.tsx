export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#0052FF' }}>
        Base Analytics Frame
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        This is the landing page for the Base Analytics Farcaster Frame.
      </p>
      <div style={{ 
        padding: '1rem', 
        border: '1px solid #e5e7eb', 
        borderRadius: '0.5rem',
        marginBottom: '2rem' 
      }}>
        <p>To use this Frame in Farcaster, cast the following URL:</p>
        <code style={{ 
          display: 'block', 
          padding: '0.75rem', 
          background: '#f3f4f6', 
          borderRadius: '0.25rem',
          marginTop: '0.5rem' 
        }}>
          {typeof window !== 'undefined' ? window.location.origin : ''}/api/frame
        </code>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
        Powered by Dune Analytics | Next.js | Vercel
      </p>
    </main>
  );
}