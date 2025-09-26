import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Close,
  CloudUpload,
  InsertDriveFile,
  Description,
  Delete,
} from '@mui/icons-material';
import type { CreateExerciseDto } from '../types';

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (exercises: CreateExerciseDto[]) => Promise<void>;
}

interface ParsedExercise {
  title: string;
  content: string;
  description?: string;
  tags: string[];
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseTextFile = (content: string, filename: string): ParsedExercise[] => {
    // Simple parsing logic - each exercise separated by double newlines
    // Format: Title\nDescription (optional)\n\nContent\n\n---\n\n (next exercise)
    const exercises: ParsedExercise[] = [];
    const sections = content.split(/\n\s*---\s*\n/).filter(section => section.trim());

    sections.forEach((section, index) => {
      const lines = section.trim().split('\n');
      if (lines.length >= 2) {
        const title = lines[0].trim() || `${filename} - Exercise ${index + 1}`;
        const description = lines.length > 2 && lines[1].trim() !== lines[2].trim() ? lines[1].trim() : undefined;
        const contentStartIndex = description ? 2 : 1;
        const content = lines.slice(contentStartIndex).join('\n').trim();

        if (content) {
          exercises.push({
            title,
            content,
            description,
            tags: ['uploaded', filename.replace(/\.[^/.]+$/, "")], // Remove extension
          });
        }
      }
    });

    // If no sections found, treat entire content as one exercise
    if (exercises.length === 0 && content.trim()) {
      exercises.push({
        title: filename.replace(/\.[^/.]+$/, ""),
        content: content.trim(),
        tags: ['uploaded'],
      });
    }

    return exercises;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const textFiles = selectedFiles.filter(file =>
      file.type === 'text/plain' ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    );

    if (textFiles.length !== selectedFiles.length) {
      setError('Only text files (.txt, .md) are supported');
      return;
    }

    setFiles(textFiles);
    setError(null);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const textFiles = droppedFiles.filter(file =>
      file.type === 'text/plain' ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.md')
    );

    if (textFiles.length !== droppedFiles.length) {
      setError('Only text files (.txt, .md) are supported');
      return;
    }

    setFiles(textFiles);
    setError(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const allExercises: CreateExerciseDto[] = [];

      for (const file of files) {
        const content = await file.text();
        const exercises = parseTextFile(content, file.name);
        allExercises.push(...exercises);
      }

      if (allExercises.length === 0) {
        setError('No valid exercises found in the uploaded files');
        return;
      }

      await onUpload(allExercises);
      setFiles([]);
      onClose();
    } catch (err) {
      setError('Failed to upload exercises. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '60vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Upload Exercise Files
        </Typography>
        <IconButton onClick={handleClose} size="small" disabled={uploading}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Upload Area */}
          <Paper
            sx={{
              p: 4,
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 3,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.50',
                borderColor: 'primary.dark',
              },
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Drop files here or click to browse
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported formats: .txt, .md
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </Paper>

          {/* File Format Info */}
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              File Format Guidelines:
            </Typography>
            <Typography variant="body2" component="div">
              • Separate multiple exercises with "---" on a new line
              <br />
              • Format: Title, optional description, then content
              <br />
              • Example: <code>Exercise Title\nShort description\n\nDetailed content here</code>
            </Typography>
          </Alert>

          {/* Selected Files */}
          {files.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Selected Files ({files.length})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {files.map((file, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      backgroundColor: 'grey.50',
                      borderRadius: 2,
                    }}
                  >
                    <InsertDriveFile color="primary" />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(file.size / 1024).toFixed(1)} KB
                      </Typography>
                    </Box>
                    <Chip
                      label={file.name.endsWith('.md') ? 'Markdown' : 'Text'}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <Delete />
                    </IconButton>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Upload Progress */}
          {uploading && (
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Processing files...
              </Typography>
              <LinearProgress sx={{ borderRadius: 2 }} />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={uploading}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={files.length === 0 || uploading}
          startIcon={<Description />}
          sx={{ borderRadius: 2, px: 3 }}
        >
          {uploading ? 'Processing...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;