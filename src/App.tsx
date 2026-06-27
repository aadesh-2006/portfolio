import { HashRouter } from 'react-router-dom';
import { AppShell } from './core/layout/AppShell';
import { AppRoutes } from './routes';

function App() {
  return (
    <HashRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </HashRouter>
  );
}

export default App;
