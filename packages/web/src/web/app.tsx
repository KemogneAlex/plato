import { Route, Switch } from "wouter";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { ProtectedRoute } from "./components/protected-route";
import { AppLayout } from "./components/app-layout";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import DashboardPage from "./pages/dashboard";
import EditorPage from "./pages/editor";
import PreviewPage from "./pages/preview";
import SettingsPage from "./pages/settings";
import TemplatesPage from "./pages/templates";

function App() {
  return (
    <Provider>
      <Switch>
        {/* Public */}
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />

        {/* Protected — with AppLayout sidebar */}
        <Route path="/dashboard">
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        </Route>

        <Route path="/editor/:id">
          {(params) => (
            <ProtectedRoute>
              <EditorPage />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/preview/:id">
          {(params) => (
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/settings/:id">
          {(params) => (
            <ProtectedRoute>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </ProtectedRoute>
          )}
        </Route>

        <Route path="/templates">
          <ProtectedRoute>
            <AppLayout>
              <TemplatesPage />
            </AppLayout>
          </ProtectedRoute>
        </Route>
      </Switch>

      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
      {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
      {<RunableBadge />}
    </Provider>
  );
}

export default App;
