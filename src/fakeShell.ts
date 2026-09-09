export type ShellContext = {
  username: string
  hostname: string
  cwd: string
  riceLabel: string
  wm: string
  cpu: string
  gpu: string
  terminalName: string
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
    return [
      'LARP shell — visual only, never executes configs.',
      'Commands: clear, neofetch, fastfetch, ls, pwd, echo, help',
      'Anything else gets a funny LARP error.',
    ]
  }
  if (lower === 'pwd') {
    return [ctx.cwd]
  }
  if (lower === 'ls') {
    return ['.config  .local  Pictures  rice.md  Downloads  Music']
  }
  if (lower === 'echo') {
    return [arg]
  }
  if (lower === 'neofetch' || lower === 'fastfetch') {
    return [
      `${ctx.username}@${ctx.hostname}`,
      '-----------------',
      'OS: Arch Linux x86_64',
      'Host: LARP Linux (not real)',
      'Kernel: 6.10.arch-larp',
      `WM: ${ctx.wm}`,
      `CPU: ${ctx.cpu}`,
      `GPU: ${ctx.gpu}`,
      'Memory: 64 GiB (fake)',
      `Terminal: ${ctx.terminalName}`,
      `Rice: ${ctx.riceLabel}`,
      '',
      'you are not installing arch.',
      'you are larping.',
    ]
  }

  const joke = FUNNY[Math.floor(Math.random() * FUNNY.length)]
  return [`${cmd}: ${joke}`]
}
