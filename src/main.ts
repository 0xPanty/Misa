// Misa AI Web - 简化版 main.ts (无 AG-UI 依赖)
import { TerminalEngine } from "./engine/TerminalEngine";
import { marked } from "marked";
import DOMPurify from "dompurify";

const pkg = { name: "Misa AI", version: "1.0.0" };

// Markdown 渲染器
const renderMarkdown = (md: string): string => {
  return DOMPurify.sanitize(marked.parse(md, { async: false }) as string);
};

// 自动滚动控制器
const createAutoScrollController = (el: HTMLElement) => {
  let autoScroll = true;
  el.addEventListener("scroll", () => {
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
    autoScroll = atBottom;
  });
  return {
    maybeScroll: () => {
      if (autoScroll) {
        el.scrollTop = el.scrollHeight;
      }
    }
  };
};

// UI 配置 (从 /api/config 获取)
interface UiConfig {
  themeColor: string;
  userColor: string;
  toolColor: string;
  typeSpeed: number;
  opacity: number;
  soundVolume: number;
  mouthInterval: number;
  beepFrequency: number;
  beepDuration: number;
  beepVolumeEnd: number;
  avatarOverlayOpacity?: number;
  avatarBrightness?: number;
  glowText?: number;
  glowBox?: number;
  brightness?: number;
  nameTags: { user: string; avatar: string; avatarFullName: string };
  systemMessages: { banner1: string; banner2: string };
}

let config: { ui: UiConfig } | null = null;

// 获取配置
async function fetchConfig(): Promise<void> {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error('Failed to fetch config');
  config = await res.json();
}

// 聊天历史
const chatHistory: { role: string; content: string }[] = [];

// 发送消息并处理流式响应
async function sendMessage(
  message: string, 
  engine: TerminalEngine,
  onError: (err: string) => void
): Promise<void> {
  chatHistory.push({ role: 'user', content: message });

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: chatHistory })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Request failed');
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let fullResponse = '';

  // 开始新的 AI 回复行
  engine.startNewMessage('text-line text-line--assistant', '');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.text) {
            fullResponse += parsed.text;
            engine.pushText(parsed.text);
          }
          if (parsed.error) {
            onError(parsed.error);
          }
        } catch {}
      }
    }
  }

  chatHistory.push({ role: 'assistant', content: fullResponse });
}

// 初始化应用
async function initApp() {
  const inputEl = document.getElementById("input") as HTMLInputElement;
  const outputEl = document.querySelector("#pane-output .text-scroll") as HTMLElement;
  const avatarImg = document.getElementById("avatar-img") as HTMLImageElement;
  const metaBar = document.getElementById("meta");
  const avatarLabel = document.getElementById("avatar-label");

  if (!inputEl || !outputEl || !avatarImg || !avatarLabel) {
    throw new Error("UI elements missing");
  }

  if (metaBar) metaBar.textContent = `${pkg.name} v${pkg.version}`;

  // 显示加载中
  inputEl.disabled = true;
  outputEl.innerHTML = '<div class="text-line text-line--system">> Connecting...</div>';

  // 获取配置
  try {
    await fetchConfig();
  } catch {
    outputEl.innerHTML = '<div class="text-line text-line--error">> Failed to connect</div>';
    return;
  }

  // 清空并启用输入
  outputEl.innerHTML = '';
  inputEl.disabled = false;
  inputEl.focus();

  // 应用配置
  const ui = config!.ui;
  avatarLabel.textContent = ui.nameTags.avatar;

  // 应用颜色主题
  const root = document.documentElement;
  const hexToRgb = (hex: string) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
  };

  const applyColor = (hex: string, prefix: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      root.style.setProperty(`--${prefix}-r`, String(rgb.r));
      root.style.setProperty(`--${prefix}-g`, String(rgb.g));
      root.style.setProperty(`--${prefix}-b`, String(rgb.b));
    }
  };

  applyColor(ui.themeColor, 'theme-color');
  applyColor(ui.userColor, 'user-color');
  applyColor(ui.toolColor, 'tool-color');

  if (ui.opacity !== undefined) root.style.setProperty('--ui-opacity', String(ui.opacity));
  if (ui.avatarOverlayOpacity !== undefined) root.style.setProperty('--avatar-overlay-opacity', String(ui.avatarOverlayOpacity));
  if (ui.avatarBrightness !== undefined) root.style.setProperty('--avatar-brightness', String(ui.avatarBrightness));
  if (ui.glowText !== undefined) {
    root.style.setProperty('--glow-text-alpha1', String(0.6 * ui.glowText));
    root.style.setProperty('--glow-text-alpha2', String(0.4 * ui.glowText));
  }
  if (ui.glowBox !== undefined) {
    root.style.setProperty('--glow-box-alpha1', String(0.4 * ui.glowBox));
    root.style.setProperty('--glow-box-alpha2', String(0.2 * ui.glowBox));
  }
  if (ui.brightness !== undefined) root.style.setProperty('--ui-brightness', String(ui.brightness));

  // 初始化 TerminalEngine (打字动画 + 口型 + 音效)
  const autoScroll = createAutoScrollController(outputEl);
  
  // 注入配置到 window 供 TerminalEngine 使用
  (window as any).__MISA_CONFIG__ = {
    typeSpeed: ui.typeSpeed,
    mouthInterval: ui.mouthInterval,
    beepFrequency: ui.beepFrequency,
    beepDuration: ui.beepDuration,
    soundVolume: ui.soundVolume,
    beepVolumeEnd: ui.beepVolumeEnd
  };

  const engine = new TerminalEngine(outputEl, avatarImg, renderMarkdown, autoScroll);

  // 添加文本行
  const appendLine = (className: string, text: string) => {
    const line = document.createElement("div");
    line.className = `text-line ${className}`;
    line.textContent = text;
    outputEl.appendChild(line);
    autoScroll.maybeScroll();
  };

  // 显示初始消息
  const fullName = ui.nameTags.avatarFullName || ui.nameTags.avatar || "AGENT";
  if (ui.systemMessages.banner1) {
    appendLine("text-line--system", `> ${ui.systemMessages.banner1.replace("{avatarFullName}", fullName)}`);
  }
  if (ui.systemMessages.banner2) {
    appendLine("text-line--system", `> ${ui.systemMessages.banner2}`);
  }

  // 处理输入
  let isRunning = false;

  inputEl.addEventListener("keydown", async (e) => {
    if (e.isComposing || e.key !== "Enter" || isRunning) return;
    e.preventDefault();

    const value = inputEl.value.trim();
    if (!value) return;

    // 显示用户消息
    const userTag = ui.nameTags.user ? `${ui.nameTags.user}> ` : "> ";
    appendLine("text-line--user", `${userTag}${value}`);
    inputEl.value = "";

    isRunning = true;
    try {
      await sendMessage(value, engine, (err) => {
        appendLine("text-line--error", `Error: ${err}`);
      });
    } catch (error: any) {
      appendLine("text-line--error", `Error: ${error.message}`);
    } finally {
      isRunning = false;
    }
  });
}

// 启动
initApp().catch(err => console.error("Fatal Error:", err));
