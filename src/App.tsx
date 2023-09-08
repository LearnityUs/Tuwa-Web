import { lazy, type Component } from 'solid-js';
import { Navigate, Route, Routes } from '@solidjs/router';
import { I18nProvider } from './locales';
import { Background } from './components/Background';

// Import pages
import './pages/Home';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));

export const App: Component = () => {
    return (
        <>
            <I18nProvider>
                <Routes>
                    <Route path='/' element={<Navigate href='/home' />} />
                    <Route path='/home' element={<Home />} />
                </Routes>
            </I18nProvider>
            <Background />
        </>
    );
};
