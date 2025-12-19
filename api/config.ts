// Vercel API Route: /api/config
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.json({
    ui: {
      themeColor: "#33ff99",
      userColor: "#64ffff",
      toolColor: "#ffaa00",
      typeSpeed: 30,
      opacity: 0.85,
      soundVolume: 0.03,
      mouthInterval: 120,
      beepFrequency: 800,
      beepDuration: 0.03,
      beepVolumeEnd: 0.001,
      avatarOverlayOpacity: 0.15,
      avatarBrightness: 1.1,
      glowText: 1,
      glowBox: 1,
      brightness: 1,
      nameTags: {
        user: "YOU",
        avatar: "MISA",
        avatarFullName: "Misa AI"
      },
      systemMessages: {
        banner1: "SYSTEM {avatarFullName} Online",
        banner2: "Ready to chat~ (◕‿◕)"
      }
    }
  });
}
