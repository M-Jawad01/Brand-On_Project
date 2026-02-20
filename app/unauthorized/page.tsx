export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-brand-base flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-brand-secondary-light p-8 rounded-lg border border-brand-accent-dark/30 text-center">
        <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="flex gap-3 justify-center">
          <a 
            href="/" 
            className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-dark rounded text-white font-medium transition"
          >
            Go Home
          </a>
          <a 
            href="/login" 
            className="px-6 py-2 bg-brand-accent-light hover:bg-brand-accent rounded text-white font-medium transition"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
