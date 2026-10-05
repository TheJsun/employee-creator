import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import classes from "./LoginPage.module.scss";

export function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (loading) return null; //add skeleton loading form eventually

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={classes.page}>
      <aside className={classes.brand} aria-hidden="true">
        <h2 className={classes.headline}>Everyone on your team, in one place.</h2>
        <p className={classes.subcopy}>
          Find people, check contract details and keep employment records
          together.
        </p>
      </aside>

      <main className={classes.formSide}>
        <div className={classes.panel}>
          <div className={classes.card}>
            <div className={classes.header}>
              <h1 className={classes.title}>Sign in</h1>
              <p className={classes.subtitle}>Use your work email.</p>
            </div>

            <form className={classes.form} onSubmit={handleSubmit}>
              <div className={classes.group}>
                <label className={classes.label} htmlFor="email">
                  Work email
                </label>
                <input
                  className={classes.field}
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className={classes.group}>
                <label className={classes.label} htmlFor="password">
                  Password
                </label>
                <div className={classes.passwordWrap}>
                  <input
                    className={classes.field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className={classes.toggle}
                    type="button"
                    onClick={() => setShowPassword((shown) => !shown)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p className={classes.errorBox} role="alert">
                  {error}
                </p>
              )}

              <Button
                className={classes.submit}
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>

          <p className={classes.footer}>
            Accounts are created by{" "}
            <span className={classes.footerEmphasis}>your administrator</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
