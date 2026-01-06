import { readdirSync, statSync, writeFileSync, readFileSync } from 'fs';
import { join, relative, basename, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DOCS_DIR = join(__dirname, 'docs');
const CONFIG_PATH = join(DOCS_DIR, '.vitepress', 'config.mts');

// 排除的目录
const EXCLUDE_DIRS = ['.vitepress', 'node_modules', '.git', 'dist', 'cache'];
// 排除的文件
const EXCLUDE_FILES = ['home.md', 'index.md'];

/**
 * 获取目录下的所有文件和子目录
 */
function getDirectoryContents(dirPath) {
  const items = readdirSync(dirPath);
  const result = {
    dirs: [],
    files: []
  };

  items.forEach(item => {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(item)) {
        result.dirs.push(item);
      }
    } else if (stat.isFile() && item.endsWith('.md')) {
      if (!EXCLUDE_FILES.includes(item)) {
        result.files.push(item);
      }
    }
  });

  return result;
}

/**
 * 递归扫描目录结构
 */
function scanDirectory(dirPath, basePath = '') {
  const relativePath = relative(DOCS_DIR, dirPath);
  const { dirs, files } = getDirectoryContents(dirPath);

  const structure = {
    path: relativePath || '.',
    dirs: [],
    files: [],
    children: []
  };

  // 添加文件
  files.forEach(file => {
    structure.files.push({
      name: file,
      title: file.replace(/\.md$/, ''),
      link: join(relativePath, file).replace(/\\/g, '/')
    });
  });

  // 递归扫描子目录
  dirs.forEach(dir => {
    const subDirPath = join(dirPath, dir);
    const subStructure = scanDirectory(subDirPath, join(basePath, dir));
    structure.children.push({
      name: dir,
      ...subStructure
    });
  });

  return structure;
}

/**
 * 生成 home.md 内容
 */
function generateHomeContent(structure, currentPath = '') {
  let content = '# 目录\n\n';
  let index = 1;

  // 首先列出子目录
  structure.children.forEach(child => {
    content += `${index}. ${child.name}\n`;

    // 如果子目录有文件，列出文件
    if (child.files && child.files.length > 0) {
      child.files.forEach(file => {
        const linkPath = `./${child.name}/${file.name}`;
        content += `    - [${file.title}](${linkPath})\n`;
      });
    }

    index++;
  });

  // 然后列出当前目录的文件
  if (structure.files && structure.files.length > 0) {
    structure.files.forEach(file => {
      content += `${index}. [${file.title}](./${file.name})\n`;
      index++;
    });
  }

  return content;
}

/**
 * 生成并保存 home.md 文件
 * 只为一级目录（interview、dev等）生成 home.md
 */
function generateHomeFiles(structure, basePath = DOCS_DIR) {
  // 只为一级子目录生成 home.md（不递归到更深层级）
  structure.children.forEach(child => {
    if (child.children.length > 0 || child.files.length > 0) {
      const homeContent = generateHomeContent(child);
      const homePath = join(basePath, child.name, 'home.md');
      writeFileSync(homePath, homeContent, 'utf-8');
      console.log(`Generated: ${homePath}`);
    }
  });
}

/**
 * 生成 sidebar 配置
 */
function generateSidebarConfig(structure) {
  const sidebar = {};

  // 为每个一级子目录生成 sidebar 配置
  structure.children.forEach(child => {
    const path = `/${child.name}/`;
    sidebar[path] = [
      {
        items: [
          { text: '目录', link: `${path}home` }
        ]
      }
    ];

    // 添加子目录作为折叠组
    child.children.forEach(subChild => {
      const group = {
        text: subChild.name,
        collapsed: true,
        items: []
      };

      // 添加子目录中的文件
      if (subChild.files && subChild.files.length > 0) {
        subChild.files.forEach(file => {
          const link = `${path}${subChild.name}/${file.title}`;
          group.items.push({
            text: file.title,
            link: link
          });
        });
      }

      sidebar[path].push(group);
    });

    // 添加当前目录的文件
    if (child.files && child.files.length > 0) {
      const directFiles = {
        text: '其他',
        collapsed: false,
        items: child.files.map(file => ({
          text: file.title,
          link: `${path}${file.title}`
        }))
      };
      sidebar[path].push(directFiles);
    }
  });

  return sidebar;
}

/**
 * 查找 sidebar 配置的结束位置
 */
function findSidebarEnd(content, startIndex) {
  let braceCount = 0;
  let inString = false;
  let stringChar = null;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : null;

    // 处理字符串
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
    }

    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          return i;
        }
      }
    }
  }

  return -1;
}

/**
 * 更新 config.mts 文件
 */
function updateConfigFile(sidebarConfig) {
  let configContent = readFileSync(CONFIG_PATH, 'utf-8');

  // 将 sidebar 对象转换为格式化的字符串
  const sidebarString = JSON.stringify(sidebarConfig, null, 2)
    .replace(/"(\w+)":/g, '$1:') // 移除属性名的引号
    .replace(/"/g, "'"); // 将双引号替换为单引号

  // 查找 sidebar: { 的位置
  const sidebarStart = configContent.indexOf('sidebar:');
  if (sidebarStart === -1) {
    console.error('Could not find sidebar configuration in config.mts');
    return;
  }

  // 查找 sidebar 对象开始的花括号
  const braceStart = configContent.indexOf('{', sidebarStart);
  if (braceStart === -1) {
    console.error('Could not find sidebar object start');
    return;
  }

  // 查找 sidebar 对象结束的花括号
  const braceEnd = findSidebarEnd(configContent, braceStart);
  if (braceEnd === -1) {
    console.error('Could not find sidebar object end');
    return;
  }

  // 查找结束花括号后的逗号
  let commaPos = braceEnd + 1;
  while (commaPos < configContent.length && /\s/.test(configContent[commaPos])) {
    commaPos++;
  }

  const endPos = configContent[commaPos] === ',' ? commaPos + 1 : braceEnd + 1;

  // 替换整个 sidebar 配置
  const before = configContent.substring(0, sidebarStart);
  const after = configContent.substring(endPos);

  configContent = before + `sidebar: ${sidebarString},` + after;

  writeFileSync(CONFIG_PATH, configContent, 'utf-8');
  console.log(`Updated: ${CONFIG_PATH}`);
}

/**
 * 主函数
 */
function main() {
  console.log('Scanning docs directory...\n');

  // 扫描目录结构
  const structure = scanDirectory(DOCS_DIR);

  console.log('\nGenerating home.md files...\n');

  // 生成 home.md 文件
  generateHomeFiles(structure);

  console.log('\nGenerating sidebar configuration...\n');

  // 生成 sidebar 配置
  const sidebarConfig = generateSidebarConfig(structure);

  // 更新 config.mts
  updateConfigFile(sidebarConfig);

  console.log('\nDone! All files have been generated successfully.');
}

// 运行主函数
main();
