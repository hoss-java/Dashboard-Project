// src/components/WelcomeScreen.tsx
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Container, Box, AppBar, Toolbar, Typography } from '@mui/material';
import useManifest from '../hooks/useManifest';

interface WelcomeScreenProps {
  onClose?: () => void;
}

function WelcomeScreen({ onClose }: WelcomeScreenProps) {
  const [readme, setReadme] = useState<string>('');
  const manifest = useManifest();

  useEffect(() => {
    fetch('/README.md')
      .then((response) => response.text())
      .then((text) => setReadme(text))
      .catch((error) => console.error('Error loading README:', error));
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {manifest.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, flexGrow: 1 }}>
        <Box
          sx={{
            bgcolor: 'white',
            p: 4,
            borderRadius: 1,
            boxShadow: 1,
            '& h2': { color: '#1976d2', mt: 3, mb: 2 },
            '& h3': { color: '#1565c0', mt: 2, mb: 1 },
            '& code': { 
              bgcolor: '#f5f5f5', 
              px: 1, 
              py: 0.5, 
              borderRadius: 0.5,
              fontFamily: '"Courier New", monospace',
              fontSize: '0.9em',
              color: '#d73a49'
            },
            '& pre': { m: 2, borderRadius: 1 },
            '& table': { 
              width: '100%', 
              borderCollapse: 'collapse',
              my: 2,
              border: '1px solid #ddd'
            },
            '& th': { 
              bgcolor: '#1976d2', 
              color: 'white', 
              p: 1.5, 
              textAlign: 'left',
              fontWeight: 600,
              border: '1px solid #ddd'
            },
            '& td': { 
              p: 1.5, 
              border: '1px solid #ddd'
            },
            '& tr:nth-of-type(even)': { bgcolor: '#f9f9f9' },
            '& tr:hover': { bgcolor: '#f0f0f0' },
            '& ul, & ol': { my: 1, pl: 2.5 },
            '& li': { my: 0.5 },
            '& a': { color: '#1976d2', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
            '& hr': { border: 'none', borderTop: '2px solid #ddd', my: 2.5 },
            '& blockquote': { 
              borderLeft: '4px solid #1976d2', 
              pl: 2, 
              my: 2, 
              color: '#666',
              fontStyle: 'italic'
            }
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {readme}
          </ReactMarkdown>
        </Box>
      </Container>
    </Box>
  );
}

export default WelcomeScreen;
