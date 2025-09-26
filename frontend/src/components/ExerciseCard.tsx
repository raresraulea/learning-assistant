import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import type { ExerciseModel } from '../types';

interface ExerciseCardProps {
  exercise: ExerciseModel;
  onEdit: (exercise: ExerciseModel) => void;
  onDelete: (id: number) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onEdit, onDelete }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: 'text.primary',
            fontSize: '1.1rem',
          }}
        >
          {exercise.title}
        </Typography>

        {exercise.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {exercise.description}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          Content: {exercise.content.substring(0, 100)}{exercise.content.length > 100 ? '...' : ''}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            Tags ({exercise.tags.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {exercise.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  backgroundColor: 'primary.50',
                  color: 'primary.main',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            ))}
            {exercise.tags.length > 3 && (
              <Chip
                label={`+${exercise.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem', height: 24 }}
              />
            )}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(exercise.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
        <Box>
          <IconButton
            size="small"
            onClick={() => onEdit(exercise)}
            sx={{
              color: 'primary.main',
              '&:hover': { backgroundColor: 'primary.50' }
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDelete(exercise.id)}
            sx={{
              color: 'error.main',
              '&:hover': { backgroundColor: 'error.50' }
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ExerciseCard;