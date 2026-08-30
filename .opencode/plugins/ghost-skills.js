/**
 * d7r Skills plugin for OpenCode.ai
 *
 * Injects the ghost-skills bootstrap context via the chat-message transform and
 * auto-registers the skills directory via the config hook (no symlinks needed).
 * Adapted from the epic-flowstate-skills OpenCode plugin (MIT).
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const stripFrontmatter = (content) => {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  return match ? match[1] : content;
};

let _bootstrapCache;

export const SkillsPlugin = async () => {
  const skillsDir = path.resolve(__dirname, '../../skills');

  const getBootstrapContent = () => {
    if (_bootstrapCache !== undefined) return _bootstrapCache;
    const skillPath = path.join(skillsDir, 'ghost-using-ghost-skills', 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      _bootstrapCache = null;
      return null;
    }
    const content = stripFrontmatter(fs.readFileSync(skillPath, 'utf8'));
    const toolMapping = [
      '**Tool Mapping for OpenCode:**',
      'When skills reference tools you do not have, substitute OpenCode equivalents:',
      '- `TodoWrite` becomes `todowrite`',
      '- `Task` with subagents becomes the @mention subagent system',
      '- `Skill` tool becomes the native `skill` tool',
      '- `Read`, `Write`, `Edit`, `Bash` become your native tools',
    ].join('\n');
    _bootstrapCache = [
      '<EXTREMELY_IMPORTANT>',
      'You have ghost skills available.',
      '',
      '**The ghost-using-ghost-skills bootstrap content is included below and is ALREADY LOADED; do not load it again.**',
      '',
      content,
      '',
      toolMapping,
      '</EXTREMELY_IMPORTANT>',
    ].join('\n');
    return _bootstrapCache;
  };

  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    },

    'experimental.chat.messages.transform': async (_input, output) => {
      const bootstrap = getBootstrapContent();
      if (!bootstrap || !output.messages.length) return;
      const firstUser = output.messages.find((m) => m.info.role === 'user');
      if (!firstUser || !firstUser.parts.length) return;
      if (firstUser.parts.some((p) => p.type === 'text' && p.text.includes('EXTREMELY_IMPORTANT'))) return;
      const ref = firstUser.parts[0];
      firstUser.parts.unshift({ ...ref, type: 'text', text: bootstrap });
    },
  };
};
