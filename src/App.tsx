import { lazy, type Component } from 'solid-js';
import { Navigate, Outlet, Route, Routes } from '@solidjs/router';
import { I18nProvider } from './locales';

// Import pages
import './pages/Home';
import './pages/Identification';
import './pages/Settings';
import './pages/About';
import './pages/[404]';
import { DefaultLayout } from './layouts/Default';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Identification = lazy(() => import('./pages/Identification'));
const Settings = lazy(() => import('./pages/Settings'));
const About = lazy(() => import('./pages/About'));
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
                        <Route path='/identification' element={<Identification />} />
                        <Route path='/settings' element={<Settings />} />
                        <Route path='/about' element={<About />} />
                        <Route path='*' element={<NotFound />} />
                    </Route>
                </Routes>
            </I18nProvider>
        </>
    );
};
