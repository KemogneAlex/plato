import { useState } from "react";
import { Link, useLocation } from "wouter";
import { authClient, captureToken } from "../lib/auth";
import { ChefHat, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authClient.signIn.email(
        { email, password },
        { onSuccess: captureToken }
      );
      if (res.error) {
        setError("Email ou mot de passe incorrect.");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-body)" }}>
      {/* Left — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link to="/">
            <a className="inline-flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--color-primary)" }}>
                <ChefHat size={18} color="white" />
              </div>
              <span className="font-bold text-xl" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>Plato</span>
            </a>
          </Link>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-dark)" }}>
            Bon retour 👋
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--color-gray)" }}>
            Connectez-vous à votre compte Plato
          </p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm" style={{ background: "rgba(239,68,68,0.08)", color: "var(--color-danger)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-dark)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@restaurant.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  border: "1.5px solid #E5E7EB",
                  color: "var(--color-dark)",
                  background: "white",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.12)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--color-dark)" }}>Mot de passe</label>
                <a href="#" className="text-xs" style={{ color: "var(--color-primary)" }}>Mot de passe oublié ?</a>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{ border: "1.5px solid #E5E7EB", color: "var(--color-dark)", background: "white" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.12)"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-gray)" }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "var(--color-primary)", color: "white", opacity: loading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "var(--color-primary-dark)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--color-primary)"; }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-gray)" }}>
            Pas encore de compte ?{" "}
            <Link to="/register">
              <a className="font-semibold" style={{ color: "var(--color-primary)" }}>Créer un compte</a>
            </Link>
          </p>
        </div>
      </div>

      {/* Right — visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "var(--color-primary)" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div className="relative text-center">
          <div className="text-7xl mb-6">🍽️</div>
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-display)", color: "white" }}>
            Votre restaurant,<br />votre identité
          </h2>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.75)", maxWidth: 300 }}>
            Créez un site professionnel qui reflète l'âme de votre établissement.
          </p>
        </div>
      </div>
    </div>
  );
}
