import { Link } from "react-router-dom";
import { FlaskConical, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <FlaskConical className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-7xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-2">Experiment not found</h2>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
          <ArrowLeft className="h-4 w-4" /> Go to FundoLabs Home
        </Link>
      </div>
    </div>
  );
}
