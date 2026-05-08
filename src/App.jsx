import React, { lazy, Suspense, useEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet as RNStyleSheet, View } from 'react-native-web';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ANALYTICS_EVENTS } from './analytics/events';
import { useAnalytics } from './hooks/useAnalytics';

const DashboardScreen = lazy(() =>
  import('./features/dashboard/DashboardScreen').then((m) => ({ default: m.DashboardScreen })),
);

function RouteAnalyticsShell() {
  const location = useLocation();
  const { track } = useAnalytics();

  useEffect(() => {
    track(ANALYTICS_EVENTS.PAGE_VIEW, {
      page_location: `${location.pathname}${location.search}`,
      page_title: 'Wealth Curator Dashboard',
    });
  }, [location.pathname, location.search, track]);

  const fallback = useMemo(
    () => (
      <View style={styles.fallback} accessibilityRole="progressbar">
        <ActivityIndicator color="#c9a962" size="large" />
      </View>
    ),
    [],
  );

  return (
    <Suspense fallback={fallback}>
      <Routes>
        <Route
          path="/"
          element={
            <DashboardErrorBoundary onError={() => track(ANALYTICS_EVENTS.LAZY_CHUNK_ERROR, { chunk: 'DashboardScreen' })}>
              <DashboardScreen />
            </DashboardErrorBoundary>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteAnalyticsShell />
    </BrowserRouter>
  );
}

class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <ActivityIndicator color="#c9a962" />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = RNStyleSheet.create({
  fallback: {
    flex: 1,
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b0f14',
  },
});
