import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Find the root element from index.html where React will render the app.
const rootElement = document.getElementById('root');

if (!rootElement) {
	throw new Error('Could not find the app root element in index.html.');
}

// StrictMode helps React point out common development issues.
createRoot(rootElement).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
