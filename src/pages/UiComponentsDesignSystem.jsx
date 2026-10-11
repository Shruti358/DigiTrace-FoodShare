import React from 'react';
import AppLayout from '../components/AppLayout';

export default function UiComponentsDesignSystem() {
  return (
    <AppLayout pageTitle="Design System Tokens" breadcrumbs={[{ label: 'Design System' }]}>
      <div className="flex flex-col gap-space-xs">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">DIGITRACE COMPONENT LIBRARY</span>
        <h1 className="font-display-lg text-display-lg text-on-surface font-bold tracking-tight">Design System & UI Components</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Material 3 design system tokens, color palettes, typographic hierarchy, buttons, and state indicators used across DigiTrace.
        </p>
      </div>

      {/* Section 1: Colors */}
      <section className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-low space-y-space-md">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Color Palette Tokens</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-space-sm">
          <div className="p-space-sm rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold flex flex-col justify-between h-20 shadow-xs">
            <span>Primary</span>
            <span className="font-mono text-[10px]">#006948</span>
          </div>
          <div className="p-space-sm rounded-lg bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold flex flex-col justify-between h-20 shadow-xs">
            <span>Primary Container</span>
            <span className="font-mono text-[10px]">#00855D</span>
          </div>
          <div className="p-space-sm rounded-lg bg-tertiary text-on-tertiary font-label-sm text-label-sm font-semibold flex flex-col justify-between h-20 shadow-xs">
            <span>Tertiary</span>
            <span className="font-mono text-[10px]">#006194</span>
          </div>
          <div className="p-space-sm rounded-lg bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex flex-col justify-between h-20 shadow-xs">
            <span>Secondary Container</span>
            <span className="font-mono text-[10px]">#DAE2FD</span>
          </div>
          <div className="p-space-sm rounded-lg bg-error text-on-error font-label-sm text-label-sm font-semibold flex flex-col justify-between h-20 shadow-xs">
            <span>Error / Discard</span>
            <span className="font-mono text-[10px]">#BA1A1A</span>
          </div>
          <div className="p-space-sm rounded-lg bg-surface-container-low text-on-surface font-label-sm text-label-sm font-semibold flex flex-col justify-between h-20 border border-surface-container-high">
            <span>Surface Low</span>
            <span className="font-mono text-[10px]">#EFF4FF</span>
          </div>
        </div>
      </section>

      {/* Section 2: Buttons & Badges */}
      <section className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-surface-container-low space-y-space-md">
        <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Button Variants & Badges</h2>
        <div className="flex flex-wrap items-center gap-space-md">
          <button className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg font-semibold shadow-sm hover:bg-primary-container transition-colors">
            Primary Action
          </button>
          <button className="px-space-md py-2 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant font-label-lg text-label-lg font-medium shadow-xs hover:bg-surface-container-low transition-colors">
            Secondary Action
          </button>
          <button className="px-space-md py-2 rounded-lg bg-tertiary text-on-tertiary font-label-lg text-label-lg font-semibold shadow-sm hover:bg-tertiary-container transition-colors">
            Tertiary Rescue
          </button>

          <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
            Composted (Primary Badge)
          </span>
          <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
            Donated (Rescue Badge)
          </span>
          <span className="px-3 py-1 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
            Waste Alert
          </span>
        </div>
      </section>
    </AppLayout>
  );
}
