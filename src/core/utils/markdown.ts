export interface Frontmatter {
  title: string;
  status: string;
  tags: string[];
  metrics: Array<{ label: string; value: string }>;
  [key: string]: any;
}

export interface ParsedMarkdown {
  frontmatter: Frontmatter;
  content: string;
}

export const parseMarkdown = (rawText: string): ParsedMarkdown => {
  const frontmatter: Frontmatter = {
    title: '',
    status: '',
    tags: [],
    metrics: [],
  };

  let content = rawText;

  // Extract frontmatter between --- boundaries
  if (rawText.trim().startsWith('---')) {
    const parts = rawText.split('---');
    if (parts.length >= 3) {
      const yamlContent = parts[1].trim();
      content = parts.slice(2).join('---').trim();

      // Simple YAML line-by-line parsing
      const lines = yamlContent.split('\n');
      let currentSection: string | null = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Handle tag array elements
        if (line.trim().startsWith('-') && currentSection === 'tags') {
          const value = line.replace(/^\s*-\s*['"]?/, '').replace(/['"]?\s*$/, '');
          frontmatter.tags.push(value);
          continue;
        }

        const match = line.match(/^([^:]+):(.*)$/);
        if (match) {
          const key = match[1].trim();
          const val = match[2].trim().replace(/^['"]|['"]$/g, '');

          if (key === 'title') {
            frontmatter.title = val;
            currentSection = 'title';
          } else if (key === 'status') {
            frontmatter.status = val;
            currentSection = 'status';
          } else if (key === 'tags') {
            currentSection = 'tags';
            if (val.startsWith('[') && val.endsWith(']')) {
              frontmatter.tags = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
              currentSection = null;
            }
          } else if (key === 'metrics') {
            currentSection = 'metrics';
          }
        }
      }

      // Regex fallback to cleanly parse the metrics lists
      const metricBlockRegex = /-\s*label:\s*["']?([^"'\n]+)["']?\s*\n\s*value:\s*["']?([^"'\n]+)["']?/g;
      const metricsMatches = yamlContent.match(metricBlockRegex);
      if (metricsMatches) {
        frontmatter.metrics = metricsMatches.map(m => {
          const labelMatch = m.match(/label:\s*["']?([^"'\n]+)["']?/);
          const valueMatch = m.match(/value:\s*["']?([^"'\n]+)["']?/);
          return {
            label: labelMatch ? labelMatch[1].trim() : '',
            value: valueMatch ? valueMatch[1].trim() : '',
          };
        });
      }
    }
  }

  return { frontmatter, content };
};
