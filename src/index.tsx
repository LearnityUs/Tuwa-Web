/* @refresh reload */
import { render } from 'solid-js/web';
import 'solid-devtools';
import './index.css';
import { App } from './App';
import { Router } from '@solidjs/router';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
    );
}

// Event for url changes `popstate`
const createLocationChangeEvent = () => {
    const event = new Event('popstate');
    // Dispatch event
    window.dispatchEvent(event);
};

// Hacky way to detect url changes
const oldPushState = history.pushState;
const oldReplaceState = history.replaceState;

history.pushState = (...args) => {
    oldPushState.apply(history, args);
    createLocationChangeEvent();
};

history.replaceState = (...args) => {
    oldReplaceState.apply(history, args);
    createLocationChangeEvent();
};

render(
    () => (
        <Router>
            <App />
        </Router>
    ),
    root!
);
