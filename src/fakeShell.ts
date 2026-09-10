export type ShellContext = {
  username: string
  hostname: string
  cwd: string
  riceLabel: string
  wm: string
  cpu: string
  gpu: string
  terminalName: string
  inCharacter: boolean
}

const FUNNY = [
  'zsh: command not found: pacman — this is a LARP, not Arch.',
  'hyprctl: connection refused (visual desktop only).',
  'sudo: a password is required (you are not root; you are larping).',
  'fatal: not a git repository — and also not a real machine.',
  'Permission denied: /etc/nixos (wrong distro fantasy).',
  'btw i use arch — citation needed.',
  'wayland: compositor laughed politely and did nothing.',
]

export function neofetchFacts(ctx: ShellContext): { k: string; v: string }[] {
  return [
    { k: 'OS', v: 'Arch Linux x86_64' },
    { k: 'Host', v: ctx.inCharacter ? 'ASUS ROG Strix' : 'LARP Linux (not real)' },
    { k: 'Kernel', v: ctx.inCharacter ? '6.16.4-arch1-1' : '6.10.arch-larp' },
    { k: 'WM', v: ctx.wm },
    { k: 'CPU', v: ctx.cpu },
    { k: 'GPU', v: ctx.gpu },
    { k: 'Memory', v: ctx.inCharacter ? '18432MiB / 32032MiB' : '64 GiB (fake)' },
    { k: 'Terminal', v: ctx.terminalName },
    { k: 'Rice', v: ctx.inCharacter ? ctx.riceLabel : `${ctx.riceLabel} (LARP)` },
  ]
}

export function runFakeCommand(raw: string, ctx: ShellContext): string[] {
  const line = raw.trim()
  if (!line) return []
  const [cmd, ...rest] = line.split(/\s+/)
  const arg = rest.join(' ')
  const lower = cmd.toLowerCase()

  if (lower === 'clear' || lower === 'cls') {
    return ['__CLEAR__']
  }
  if (lower === 'help') {
    if (ctx.inCharacter) {
      return ['Commands: clear, neofetch, fastfetch, ls, pwd, echo, help']
    }
    return [
      'LARP shell. Visual only, never executes configs.',
      'Commands: clear, neofetch, fastfetch, ls, pwd, echo, help',
      'Anything else gets a funny LARP error.',
    ]
  }
  if (lower === 'pwd') {
    return [ctx.cwd]
  }
  if (lower === 'ls') {
    return [
      ctx.inCharacter
        ? '.config  .local  Pictures  Downloads  Music'
        : '.config  .local  Pictures  rice.md  Downloads  Music',
    ]
  }
  if (lower === 'echo') {
    return [arg]
  }
  if (lower === 'neofetch' || lower === 'fastfetch') {
    const rows = [
      `${ctx.username}@${ctx.hostname}`,
      '-----------------',
      ...neofetchFacts(ctx).map((row) => `${row.k}: ${row.v}`),
    ]
    if (!ctx.inCharacter) {
      rows.push('', 'you are not installing arch.', 'you are larping.')
    }
    return rows
  }

  if (ctx.inCharacter) {
    return [`zsh: command not found: ${cmd}`]
  }
  const joke = FUNNY[Math.floor(Math.random() * FUNNY.length)]
  return [`${cmd}: ${joke}`]
}
