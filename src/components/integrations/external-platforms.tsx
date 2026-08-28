"use client";

import { useEffect, useState } from "react";

const EXTERNAL_PLATFORMS = {
  leetcode: {
    name: "LeetCode",
    icon: "💻",
    baseUrl: "https://leetcode.com",
    description: "Solve coding problems on LeetCode",
  },
  tryhackme: {
    name: "TryHackMe",
    icon: "🛡️",
    baseUrl: "https://tryhackme.com",
    description: "Complete authorized security challenges",
  },
  github: {
    name: "GitHub",
    icon: "🐙",
    baseUrl: "https://github.com",
    description: "View GitHub repositories and contribute",
  },
};

export function ExternalChallengeLink({
  platform,
  url,
  label = "Open Challenge",
}: {
  platform: keyof typeof EXTERNAL_PLATFORMS;
  url?: string;
  label?: string;
}) {
  const platformInfo = EXTERNAL_PLATFORMS[platform];
  if (!platformInfo) return null;

  const finalUrl = url || platformInfo.baseUrl;

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-blue-600 bg-blue-950 px-4 py-2.5 text-sm font-medium text-blue-200 transition hover:bg-blue-900"
    >
      <span>{platformInfo.icon}</span>
      <span>{label}</span>
      <span className="text-xs opacity-75">↗</span>
    </a>
  );
}

export function ExternalPlatformInfo({
  platform,
}: {
  platform: keyof typeof EXTERNAL_PLATFORMS;
}) {
  const info = EXTERNAL_PLATFORMS[platform];
  if (!info) return null;

  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-3">
      <p className="text-xs text-neutral-400">
        <span className="mr-1">{info.icon}</span>
        {info.description}
      </p>
      <p className="mt-1 text-xs text-neutral-500">
        This will open on {info.name} in a new tab. Complete the challenge there and return.
      </p>
    </div>
  );
}

/**
 * Modal for confirming external redirect
 */
export function ExternalChallengeModal({
  platform,
  challengeName,
  url,
  onConfirm,
  onCancel,
}: {
  platform: keyof typeof EXTERNAL_PLATFORMS;
  challengeName: string;
  url: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const platformInfo = EXTERNAL_PLATFORMS[platform];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-neutral-700 bg-neutral-900 p-6">
        <h3 className="mb-2 text-lg font-semibold text-white">Open External Challenge</h3>
        <p className="mb-4 text-sm text-neutral-300">
          You're about to open <strong>{challengeName}</strong> on{" "}
          <strong>{platformInfo?.name}</strong>.
        </p>

        <div className="mb-6 rounded-lg border border-neutral-700 bg-neutral-800 p-3">
          <p className="text-xs text-neutral-400">
            <span className="mr-2">{platformInfo?.icon}</span>
            Complete the challenge there, then return to mark it complete in Reckon.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
          >
            Cancel
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Open {platformInfo?.name}
          </a>
        </div>
      </div>
    </div>
  );
}
