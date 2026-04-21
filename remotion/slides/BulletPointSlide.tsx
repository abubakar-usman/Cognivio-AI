import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { theme, SLIDE_WIDTH, SLIDE_HEIGHT } from '../theme';
import type { ThemeColors } from '../theme';
import { DynamicBackground } from '../components/DynamicBackground';

interface BulletPointSlideProps {
  title: string;
  bullets: string[];
  themeColors: ThemeColors;
}

export const BulletPointSlide: React.FC<BulletPointSlideProps> = ({ title, bullets, themeColors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);

  // Adaptive layout
  const safeBullets = bullets.slice(0, 8);
  const count = safeBullets.length;
  const columns = count <= 4 ? 2 : 3;
  const cardPadding = count > 6 ? theme.spacing.sm : theme.spacing.md;
  const fontSize = count > 6 ? theme.fontSize.small : theme.fontSize.body;
  const iconSize = count > 6 ? 32 : 40;

  const cardBg = themeColors.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)';
  const cardBorder = themeColors.isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.9)';

  const accentColors = [themeColors.primary, themeColors.secondary, themeColors.accent, themeColors.primaryLight, themeColors.secondaryLight, themeColors.accentLight];

  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: theme.fonts.heading,
      }}
    >
      <DynamicBackground themeColors={themeColors} />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h2
          style={{
            fontSize: title.length > 40 ? theme.fontSize.h2 : theme.fontSize.hero * 0.75,
            fontWeight: 800,
            color: themeColors.textPrimary,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            lineHeight: 1.15,
            letterSpacing: -1,
            margin: 0,
            marginBottom: theme.spacing.md,
            textAlign: 'center',
          }}
        >
          {title}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: theme.spacing.sm,
            flex: 1,
            alignItems: 'center',
            alignContent: 'center',
          }}
        >
          {safeBullets.map((bullet, i) => {
            const delay = 18 + i * 8;
            const cardSpring = spring({ frame: frame - delay, fps, config: { damping: 12, stiffness: 70 } });
            const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
            const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);

            const activeColor = accentColors[i % accentColors.length];

            return (
              <div
                key={i}
                style={{
                  opacity: cardOpacity,
                  transform: `scale(${cardScale})`,
                  background: cardBg,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  padding: cardPadding,
                  borderRadius: theme.borderRadius.xl,
                  border: cardBorder,
                  boxShadow: theme.shadow.card,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                }}
              >
                {/* Numbered badge */}
                <div
                  style={{
                    width: iconSize,
                    height: iconSize,
                    borderRadius: theme.borderRadius.lg,
                    background: `${activeColor}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${activeColor}30`,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: iconSize * 0.45,
                      fontWeight: 800,
                      color: activeColor,
                    }}
                  >
                    {i + 1}
                  </span>
                </div>

                <p
                  style={{
                    flex: 1,
                    fontSize,
                    color: themeColors.textPrimary,
                    margin: 0,
                    lineHeight: 1.35,
                    fontWeight: 600,
                    fontFamily: theme.fonts.body,
                  }}
                >
                  {bullet}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
