import { lazy, type Component } from 'solid-js';
import { Navigate, Outlet, Route, Routes } from '@solidjs/router';
import { I18nProvider } from './locales';
import { Background } from './components/Background';

// Import pages
import './pages/Home';
import './pages/Barcode';
import './pages/Settings';
import './pages/[404]';
import { DefaultLayout } from './layouts/default';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Barcode = lazy(() => import('./pages/Barcode'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/[404]'));

// Outlets
const DefaultPageOutlet: Component = () => {
    return (
        <DefaultLayout>
            <Outlet />
        </DefaultLayout>
    );
};

export const App: Component = () => {
    return (
        <>
            <I18nProvider>
                <Routes>
                    <Route path='/' element={<Navigate href='/home' />} />
                    <Route path='/' element={<DefaultPageOutlet />}>
                        <Route path='/home' element={<Home />} />
                        <Route path='/barcode' element={<Barcode />} />
                        <Route path='/settings' element={<Settings />} />
                        <Route path='*' element={<NotFound />} />
                    </Route>
                </Routes>
            </I18nProvider>
            <Background />
        </>
    );
};
