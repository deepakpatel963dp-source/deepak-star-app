/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AuthScreens } from './components/AuthScreens';
import { HomeDashboard } from './components/HomeDashboard';
import { AiVideoCreator } from './components/AiVideoCreator';
import { VideoEditor } from './components/VideoEditor';
import { TemplatesScreen } from './components/TemplatesScreen';
import { MyProjectsScreen } from './components/MyProjectsScreen';
import { UserProfileScreen } from './components/UserProfileScreen';
import { WebAdminDashboard } from './components/WebAdminDashboard';
import { AndroidFrame } from './components/AndroidFrame';
import { PremiumModal } from './components/PremiumModal';
import { AdMobRewardedModal } from './components/AdMobRewardedModal';
import { AdMobBanner } from './components/AdMobBanner';

import { UserProfile, Template, EditorProject, AdMobConfig, Transaction } from './types';
import { INITIAL_TEMPLATES, INITIAL_PROJECTS, DEFAULT_ADMOB_CONFIG } from './data/initialData';

export default function App() {
  // App Navigation Flow
  const [screen, setScreen] = useState<'splash' | 'onboarding' | 'auth' | 'app' | 'admin'>('splash');
  const [appTab, setAppTab] = useState<'home' | 'templates' | 'creator' | 'editor' | 'projects' | 'profile'>('home');
  const [isDeviceMode, setIsDeviceMode] = useState<boolean>(true);

  // User Profile & Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'usr_demo',
    name: 'Rohit Sharma',
    email: 'rohit@example.com',
    phone: '+91 98765 43210',
    role: 'user',
    plan: 'free',
    credits: 20,
    status: 'active',
    createdAt: '2026-02-14T10:30:00Z',
  });

  // App Data
  const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
  const [projects, setProjects] = useState<EditorProject[]>(INITIAL_PROJECTS);
  const [adConfig, setAdConfig] = useState<AdMobConfig>(DEFAULT_ADMOB_CONFIG);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Modals & Active Selections
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<EditorProject | null>(null);
  const [templatesCategoryFilter, setTemplatesCategoryFilter] = useState<string | undefined>(undefined);

  // Load server templates & AdMob config on start
  useEffect(() => {
    fetch('/api/templates')
      .then((r) => r.json())
      .then((d) => {
        if (d.templates && d.templates.length > 0) {
          setTemplates(d.templates);
        }
      })
      .catch(() => {});

    fetch('/api/admob/config')
      .then((r) => r.json())
      .then((d) => {
        if (d.config) setAdConfig(d.config);
      })
      .catch(() => {});

    fetch('/api/payments/history')
      .then((r) => r.json())
      .then((d) => {
        if (d.transactions) setTransactions(d.transactions);
      })
      .catch(() => {});
  }, []);

  // Handlers
  const handleDeductCredit = () => {
    setCurrentUser((prev) => ({
      ...prev,
      credits: Math.max(prev.credits - 1, 0),
    }));
  };

  const handleRewardEarned = (rewardCredits: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      credits: prev.credits + rewardCredits,
    }));
  };

  const handlePremiumSuccess = (newPlan: 'free' | 'starter' | 'pro' | 'premium', addedCredits: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      plan: newPlan,
      credits: prev.credits + addedCredits,
    }));
    // Re-fetch transactions
    fetch('/api/payments/history')
      .then((r) => r.json())
      .then((d) => {
        if (d.transactions) setTransactions(d.transactions);
      })
      .catch(() => {});
  };

  const handleSaveProject = (savedProj: EditorProject) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === savedProj.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = savedProj;
        return copy;
      }
      return [savedProj, ...prev];
    });
  };

  const handleDeleteProject = (projId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projId));
  };

  const handleSelectTemplate = (tpl: Template) => {
    // Convert template to editor project and open editor
    const newProj: EditorProject = {
      id: `proj_${Date.now()}`,
      name: `${tpl.title} Custom`,
      aspectRatio: '9:16',
      clips: [
        {
          id: 'c1',
          type: 'image',
          url: tpl.previewUrl,
          title: tpl.title,
          duration: tpl.duration,
        },
      ],
      textOverlays: [
        {
          id: 't1',
          text: tpl.title.toUpperCase(),
          color: '#ffffff',
          fontSize: 22,
          xPercent: 50,
          yPercent: 75,
          animation: 'pop',
        },
      ],
      musicTitle: tpl.musicName,
      musicVolume: 85,
      filter: tpl.category === 'Attitude' ? 'cyberpunk' : 'cinematic-blue',
      brightness: 100,
      contrast: 105,
      speed: 1,
      updatedAt: new Date().toISOString(),
    };
    setEditingProject(newProj);
    setAppTab('editor');
  };

  const handleAddTemplate = async (newTpl: Partial<Template>) => {
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTpl),
      });
      const data = await res.json();
      if (data.success && data.template) {
        setTemplates((prev) => [data.template, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await fetch(`/api/admin/templates/${id}`, { method: 'DELETE' });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Render Screen
  if (screen === 'splash') {
    return <SplashScreen onFinish={() => setScreen('onboarding')} />;
  }

  if (screen === 'onboarding') {
    return <OnboardingScreen onComplete={() => setScreen('auth')} />;
  }

  if (screen === 'auth') {
    return (
      <AuthScreens
        onSuccess={(user) => {
          setCurrentUser(user);
          setScreen('app');
        }}
        onSkip={() => setScreen('app')}
      />
    );
  }

  if (screen === 'admin') {
    return (
      <WebAdminDashboard
        onBackToApp={() => setScreen('app')}
        templates={templates}
        onAddTemplate={handleAddTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        adConfig={adConfig}
        onUpdateAdConfig={setAdConfig}
      />
    );
  }

  // Active Android Tab view
  const renderTabContent = () => {
    switch (appTab) {
      case 'home':
        return (
          <HomeDashboard
            templates={templates}
            userCredits={currentUser.credits}
            userPlan={currentUser.plan}
            onOpenAiCreator={(mode) => setAppTab('creator')}
            onOpenEditor={(proj) => {
              setEditingProject(proj || null);
              setAppTab('editor');
            }}
            onOpenTemplates={(cat) => {
              setTemplatesCategoryFilter(cat);
              setAppTab('templates');
            }}
            onOpenProjects={() => setAppTab('projects')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onWatchAd={() => setIsRewardedAdOpen(true)}
            onSelectTemplate={handleSelectTemplate}
          />
        );

      case 'creator':
        return (
          <AiVideoCreator
            onBack={() => setAppTab('home')}
            onSaveToProjects={(p) => {
              handleSaveProject(p);
              setAppTab('projects');
            }}
            onOpenInEditor={(p) => {
              setEditingProject(p);
              setAppTab('editor');
            }}
            userCredits={currentUser.credits}
            onDeductCredit={handleDeductCredit}
            onNeedCredits={() => setIsPremiumModalOpen(true)}
          />
        );

      case 'editor':
        return (
          <VideoEditor
            project={editingProject}
            onBack={() => setAppTab('home')}
            onSave={(p) => {
              handleSaveProject(p);
              setAppTab('projects');
            }}
          />
        );

      case 'templates':
        return (
          <TemplatesScreen
            templates={templates}
            initialCategory={templatesCategoryFilter}
            onBack={() => {
              setTemplatesCategoryFilter(undefined);
              setAppTab('home');
            }}
            onSelectTemplate={handleSelectTemplate}
          />
        );

      case 'projects':
        return (
          <MyProjectsScreen
            projects={projects}
            onBack={() => setAppTab('home')}
            onOpenProject={(p) => {
              setEditingProject(p);
              setAppTab('editor');
            }}
            onDeleteProject={handleDeleteProject}
            onCreateNew={() => setAppTab('creator')}
          />
        );

      case 'profile':
        return (
          <UserProfileScreen
            user={currentUser}
            transactions={transactions}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onWatchAd={() => setIsRewardedAdOpen(true)}
            onOpenProjects={() => setAppTab('projects')}
            onLogout={() => setScreen('auth')}
            onAdminToggle={() => setScreen('admin')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AndroidFrame
        activeTab={appTab}
        onTabChange={(tab) => setAppTab(tab)}
        isDeviceMode={isDeviceMode}
        onToggleDeviceMode={() => setIsDeviceMode(!isDeviceMode)}
        onAdminClick={() => setScreen('admin')}
        userCredits={currentUser.credits}
      >
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {renderTabContent()}

          {/* AdMob Banner at bottom for Free users */}
          <AdMobBanner
            config={adConfig}
            userPlan={currentUser.plan}
            onAdClick={() => setIsPremiumModalOpen(true)}
          />
        </div>
      </AndroidFrame>

      {/* Premium Membership & UPI Gateway Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onSuccess={handlePremiumSuccess}
        currentPlan={currentUser.plan}
      />

      {/* Google AdMob Rewarded Ad Modal (+5 Credits) */}
      <AdMobRewardedModal
        isOpen={isRewardedAdOpen}
        onClose={() => setIsRewardedAdOpen(false)}
        onRewardEarned={handleRewardEarned}
        config={adConfig}
      />
    </>
  );
}
