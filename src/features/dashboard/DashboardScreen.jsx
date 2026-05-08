import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet as RNStyleSheet, Text, View, useWindowDimensions } from 'react-native-web';
import { EmptyState } from '../../components/states/EmptyState.jsx';
import { ErrorState } from '../../components/states/ErrorState.jsx';
import { LoadingState } from '../../components/states/LoadingState.jsx';
import { useAnalytics, useDebounce, useFetch, useLocalStorage } from '../../hooks';
import { ANALYTICS_EVENTS } from '../../analytics/events';
import { font, shadows, space, themes } from '../../theme';
import { AlertsSection } from './components/AlertsSection.jsx';
import { BudgetVelocityHero } from './components/BudgetVelocityHero.jsx';
import { DocumentsSection } from './components/DocumentsSection.jsx';
import { MainHeader } from './components/MainHeader.jsx';
import { PortfolioInsights } from './components/PortfolioInsights.jsx';
import { PortfolioSection } from './components/PortfolioSection.jsx';
import { SidebarNav } from './components/SidebarNav.jsx';
import { ProfileSection } from './components/ProfileSection.jsx';
import { SpendingBars } from './components/SpendingBars.jsx';
import { SummaryCards } from './components/SummaryCards.jsx';
import { TransactionsList } from './components/TransactionsList.jsx';
import { buildInsights, getPortfolioInsightsModel } from './insights.js';
import { fetchDashboardMock } from './mockApi.js';
import { scrollToSection } from './scrollToSection.js';

const DASHBOARD_KEY = 'dashboard-mock-v1';

const GUEST_USER = {
  name: 'Guest',
  initials: 'GU',
  avatarColor: '#5c6470',
  email: '—',
  planTier: '—',
  memberSince: '—',
};

const SECTION_IDS = {
  overview: 'section-overview',
  portfolio: 'section-portfolio',
  cashflow: 'section-cashflow',
  documents: 'section-documents',
  budgets: 'section-budgets',
  insights: 'section-insights',
};

export function DashboardScreen() {
  const [themeMode, setThemeMode] = useLocalStorage('wc-theme', 'dark');
  const colors = themes[themeMode];
  const { width } = useWindowDimensions();
  const isWide = width > 900;

  const { track } = useAnalytics();

  const fetcher = useCallback((signal) => fetchDashboardMock(signal), []);
  const { state, refetch } = useFetch(DASHBOARD_KEY, fetcher);

  const [nav, setNav] = useState('overview');
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 280);
  const [category, setCategory] = useState(null);

  const lastSearchTracked = useRef(null);
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) return;
    if (lastSearchTracked.current === q) return;
    lastSearchTracked.current = q;
    track(ANALYTICS_EVENTS.SEARCH, { termLen: q.length, nav });
  }, [debouncedQuery, nav, track]);

  const data = state.status === 'success' ? state.data : null;

  const insights = useMemo(() => (data ? buildInsights(data) : []), [data]);
  const insightModel = useMemo(
    () => (data && insights.length ? getPortfolioInsightsModel(data, insights) : null),
    [data, insights],
  );

  const categories = useMemo(() => {
    if (!data) return [];
    const s = new Set(data.transactions.map((t) => t.category));
    return Array.from(s).sort();
  }, [data]);

  const filteredTransactions = useMemo(() => {
    if (!data) return [];
    const raw = debouncedQuery.trim();
    const q = raw.toLowerCase();
    const digitsOnly = raw.replace(/\D/g, '');
    return data.transactions.filter((t) => {
      const catOk = category == null || t.category === category;
      if (!catOk) return false;
      if (q.length === 0 && digitsOnly.length === 0) return true;
      const hay = `${t.merchant} ${t.category} ${t.id} ${t.ticker ?? ''}`.toLowerCase();
      const textMatch = q.length > 0 && hay.includes(q);
      const amountMatch =
        digitsOnly.length > 0 && String(Math.round(Math.abs(t.amount))).includes(digitsOnly);
      return textMatch || amountMatch;
    });
  }, [data, debouncedQuery, category]);

  const summary = useMemo(() => {
    if (!data) {
      return {
        netWorth: '—',
        netWorthDelta: '—',
        spending: '—',
        spendingDelta: '—',
        savingsRate: '—',
        savingsDelta: '—',
        rawSpending: null,
      };
    }
    const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const pct = (n) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
    const pts = (n) => `${n > 0 ? '+' : ''}${n.toFixed(1)} pts`;
    return {
      netWorth: usd.format(data.summary.netWorth.amount),
      netWorthDelta: `${pct(data.summary.netWorthDeltaPct)} vs last quarter`,
      spending: usd.format(data.summary.spendingMonthly.amount),
      spendingDelta: `${pct(data.summary.spendingDeltaPct)} vs trailing average`,
      savingsRate: `${data.summary.savingsRatePct.toFixed(1)}%`,
      savingsDelta: `${pts(data.summary.savingsDeltaPts)} discipline uplift`,
      rawSpending: data.summary.spendingMonthly.amount,
    };
  }, [data]);

  const closeProfileSheet = useCallback(() => setProfileSheetOpen(false), []);

  useEffect(() => {
    if (!profileSheetOpen || typeof window === 'undefined') return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setProfileSheetOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [profileSheetOpen]);

  const onNav = useCallback(
    (k) => {
      setNav(k);
      track(ANALYTICS_EVENTS.FILTER_CLICK, { type: 'nav', value: k });
      if (k === 'profile') {
        setProfileSheetOpen(true);
        return;
      }
      setProfileSheetOpen(false);
      scrollToSection(SECTION_IDS[k]);
    },
    [track],
  );

  const onSearchFocus = useCallback(() => scrollToSection('section-cashflow'), []);

  const onProfileAvatarPress = useCallback(() => {
    setNav('profile');
    setProfileSheetOpen(true);
    track(ANALYTICS_EVENTS.FILTER_CLICK, { type: 'profile_icon', value: 'open' });
  }, [track]);

  const onProfileAction = useCallback(
    (action) => {
      track(ANALYTICS_EVENTS.FILTER_CLICK, { type: 'profile', value: action });
    },
    [track],
  );

  const onDocumentOpen = useCallback(
    (id) => {
      track(ANALYTICS_EVENTS.FILTER_CLICK, { type: 'document', value: id });
    },
    [track],
  );

  const onSelectCategory = useCallback(
    (c) => {
      setCategory(c);
      track(ANALYTICS_EVENTS.FILTER_CLICK, { type: 'category', value: c ?? 'all' });
    },
    [track],
  );

  const onToggleTheme = useCallback(() => {
    setThemeMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark';
      track(ANALYTICS_EVENTS.THEME_TOGGLE, { next });
      return next;
    });
  }, [setThemeMode, track]);

  const onExecuteStrategy = useCallback(
    (insightId, action) => {
      track(ANALYTICS_EVENTS.CTA_EXECUTE_STRATEGY, { insightId, action, nav });
    },
    [nav, track],
  );

  const onAlertCta = useCallback(
    (id) => {
      track(ANALYTICS_EVENTS.CTA_EXECUTE_STRATEGY, { kind: 'alert', alertId: id, nav });
    },
    [nav, track],
  );

  const onBudgetAdjust = useCallback(() => {
    setNav('budgets');
    track(ANALYTICS_EVENTS.FILTER_CLICK, { type: 'cta', value: 'adjust_budget_limits' });
    scrollToSection(SECTION_IDS.budgets);
  }, [track]);

  const fiscalHeading = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date()),
    [],
  );

  const isDesktop = width >= 1024;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <View style={[styles.layout, !isDesktop && styles.layoutStack]}>
        <SidebarNav colors={colors} activeNav={nav} onNav={onNav} />

        <View style={styles.mainColumn}>
          <MainHeader
            colors={colors}
            mode={themeMode}
            query={query}
            onQueryChange={setQuery}
            onSearchFocus={onSearchFocus}
            activeNav={nav}
            onNav={onNav}
            onToggleTheme={onToggleTheme}
            user={data?.user ?? GUEST_USER}
            onProfileAvatarPress={onProfileAvatarPress}
          />

          <ScrollView
            nativeID="main-content"
            accessibilityRole="main"
            style={styles.scrollFlex}
            contentContainerStyle={[styles.content, isWide && styles.contentWide]}
            keyboardShouldPersistTaps="handled"
          >
        {state.status === 'loading' ? <LoadingState colors={colors} /> : null}

        {state.status === 'error' ? (
          <ErrorState
            colors={colors}
            title="We couldn’t curate your dashboard"
            message={state.error.message}
            actionLabel="Retry"
            onAction={() => void refetch()}
          />
        ) : null}

        {state.status === 'success' && data ? (
          <View style={styles.stack}>
            <View nativeID="section-overview" accessibilityLabel="Financial overview region" style={styles.stack}>
              <View style={[styles.hero, styles.heroRow]}>
                <View style={styles.heroText}>
                  <Text style={[styles.kickerBlue, { color: colors.accent }]} accessibilityRole="text">
                    Monthly overview
                  </Text>
                  <Text style={[styles.headline, { color: colors.text }]} accessibilityRole="header">
                    Monthly Overview
                  </Text>
                  <Text style={[styles.periodSub, { color: colors.textMuted }]} accessibilityRole="text">
                    Fiscal period: {fiscalHeading}
                  </Text>
                </View>
              </View>

              <BudgetVelocityHero colors={colors} summary={summary} onAdjust={onBudgetAdjust} />

              <SummaryCards colors={colors} summary={summary} />
            </View>

            <View nativeID="section-insights">
              {insightModel ? (
                <PortfolioInsights
                  colors={colors}
                  model={insightModel}
                  data={data}
                  onExecuteStrategy={onExecuteStrategy}
                />
              ) : null}
            </View>

            <PortfolioSection colors={colors} holdings={data.holdings} />

            <View nativeID="section-budgets" accessibilityLabel="Category budgets" style={styles.stack}>
              <SpendingBars colors={colors} slices={data.spending} />
            </View>

            <View nativeID="section-cashflow" accessibilityLabel="Cashflow and transactions region" style={styles.stack}>
              <AlertsSection colors={colors} alerts={data.alerts} onAlertCta={onAlertCta} />

              {filteredTransactions.length === 0 ? (
                <EmptyState
                  colors={colors}
                  message="No transactions match these filters. Widen search or reset category chips."
                />
              ) : null}

              <TransactionsList
                colors={colors}
                rows={filteredTransactions}
                searchLabel={debouncedQuery.trim()}
                query={query}
                onQueryChange={setQuery}
                selectedCategory={category}
                categories={categories}
                onSelectCategory={onSelectCategory}
              />
            </View>

            <DocumentsSection colors={colors} documents={data.documents} onOpen={onDocumentOpen} />

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                Wealth Curator demo — append ?fail=1 to simulate errors or ?empty=1 for empty states. GA4/GTM via env IDs.
              </Text>
            </View>
          </View>
        ) : null}
          </ScrollView>
        </View>
      </View>

      {profileSheetOpen ? (
        <View
          style={[styles.profileOverlay, { zIndex: 10000 }]}
          accessibilityElementsHidden={false}
          importantForAccessibility="yes"
          pointerEvents="box-none"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss profile"
            onPress={closeProfileSheet}
            style={[styles.profileBackdrop, { backgroundColor: colors.overlay }]}
          />
          <View
            style={[
              styles.profilePanel,
              shadows.panel,
              {
                width: Math.min(width, 420),
                backgroundColor: colors.bg,
                borderLeftColor: colors.border,
              },
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.profilePanelScroll}
              contentContainerStyle={styles.profilePanelContent}
            >
              <ProfileSection
                colors={colors}
                user={data?.user ?? GUEST_USER}
                nativeID="section-profile"
                showCloseButton
                onRequestClose={closeProfileSheet}
                onEditProfile={() => {
                  onProfileAction('edit_profile');
                  closeProfileSheet();
                }}
                onSecurity={() => {
                  onProfileAction('security');
                  closeProfileSheet();
                }}
                onSignOut={() => {
                  onProfileAction('sign_out');
                  closeProfileSheet();
                }}
              />
            </ScrollView>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = RNStyleSheet.create({
  root: { flex: 1, minHeight: '100vh' },
  layout: { flex: 1, flexDirection: 'row', minHeight: '100vh' },
  layoutStack: { flexDirection: 'column' },
  mainColumn: { flex: 1, minWidth: 0, flexDirection: 'column' },
  scrollFlex: { flex: 1 },
  content: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xxl,
    paddingTop: space.md,
    gap: space.xl,
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
  },
  contentWide: {
    paddingHorizontal: space.xl,
  },
  stack: { gap: space.xl },
  hero: { gap: space.xs },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: space.lg },
  heroText: { flex: 1, gap: space.xxs, minWidth: 0 },
  kickerBlue: { fontFamily: font.sans, fontSize: 11, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase' },
  periodSub: { fontFamily: font.sans, fontSize: 14, fontWeight: '600', marginTop: space.xxs },
  headline: { fontFamily: font.sans, fontSize: 32, fontWeight: '800', lineHeight: 38, letterSpacing: -0.8, maxWidth: 920 },
  footer: { paddingTop: space.lg },
  footerText: { fontFamily: font.sans, fontSize: 12, lineHeight: 18 },
  profileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  profileBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profilePanel: {
    maxWidth: '100%',
    height: '100%',
    borderLeftWidth: 1,
  },
  profilePanelScroll: { flexGrow: 0, maxHeight: '100%' },
  profilePanelContent: { padding: space.lg, paddingBottom: space.xxl },
});
