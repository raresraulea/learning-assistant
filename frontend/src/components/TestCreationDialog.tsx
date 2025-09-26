import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Close, Delete, Shuffle, PlayArrow } from '@mui/icons-material';
import type { ExerciseModel, CreateTestDto } from '../types';

interface TestCreationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateTest: (testData: CreateTestDto) => Promise<void>;
  onStartPractice: (exercises: ExerciseModel[]) => void;
  exercises: ExerciseModel[];
}

const TestCreationDialog: React.FC<TestCreationDialogProps> = ({
  open,
  onClose,
  onCreateTest,
  onStartPractice,
  exercises,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [exerciseCount, setExerciseCount] = useState(5);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<number[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [isRandomTest, setIsRandomTest] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Get all available tags from exercises
  const availableTags = Array.from(
    new Set(exercises.flatMap(exercise => exercise.tags))
  ).sort();

  const availableFilterTags = Array.from(
    new Set(exercises.flatMap(exercise => exercise.tags))
  ).sort();

  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setName('');
      setDescription('');
      setTags([]);
      setNewTag('');
      setExerciseCount(5);
      setSelectedExerciseIds([]);
      setFilterTags([]);
      setIsRandomTest(true);
    }
  }, [open]);

  // Filter exercises based on selected tags
  const filteredExercises = exercises.filter(exercise =>
    filterTags.length === 0 || filterTags.some(tag => exercise.tags.includes(tag))
  );

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleExerciseSelection = (event: SelectChangeEvent<number[]>) => {
    const value = event.target.value as number[];
    setSelectedExerciseIds(value);
  };

  const handleFilterTagsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    setFilterTags(value);
    // Clear selected exercises when filter changes
    setSelectedExerciseIds([]);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleCreateAndStart = async () => {
    setIsCreating(true);
    try {
      const testData: CreateTestDto = {
        name: name.trim() || 'Quick Practice Test',
        description: description.trim() || undefined,
        exerciseCount: isRandomTest ? exerciseCount : selectedExerciseIds.length,
        tags,
        exerciseIds: isRandomTest ? undefined : selectedExerciseIds,
      };

      await onCreateTest(testData);

      // Generate exercises for immediate practice
      let practiceExercises: ExerciseModel[];
      if (isRandomTest) {
        const sourceExercises = filterTags.length > 0 ? filteredExercises : exercises;
        const shuffled = [...sourceExercises].sort(() => Math.random() - 0.5);
        practiceExercises = shuffled.slice(0, Math.min(exerciseCount, sourceExercises.length));
      } else {
        practiceExercises = exercises.filter(ex => selectedExerciseIds.includes(ex.id));
      }

      onStartPractice(practiceExercises);
      onClose();
    } catch (error) {
      console.error('Error creating test:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartPracticeOnly = () => {
    let practiceExercises: ExerciseModel[];
    if (isRandomTest) {
      const sourceExercises = filterTags.length > 0 ? filteredExercises : exercises;
      const shuffled = [...sourceExercises].sort(() => Math.random() - 0.5);
      practiceExercises = shuffled.slice(0, Math.min(exerciseCount, sourceExercises.length));
    } else {
      practiceExercises = exercises.filter(ex => selectedExerciseIds.includes(ex.id));
    }

    onStartPractice(practiceExercises);
    onClose();
  };

  const canCreate = isRandomTest ? exerciseCount > 0 : selectedExerciseIds.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '70vh',
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
          Create Practice Test
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* Test Type Selection */}
          <FormControlLabel
            control={
              <Switch
                checked={isRandomTest}
                onChange={(e) => setIsRandomTest(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {isRandomTest ? 'Random Test' : 'Custom Selection'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isRandomTest
                    ? 'Automatically select random exercises'
                    : 'Manually choose specific exercises'
                  }
                </Typography>
              </Box>
            }
          />

          <Divider />

          {/* Test Details */}
          <TextField
            label="Test Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            placeholder="Quick Practice Test"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          <TextField
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Filter by Tags */}
          {isRandomTest && (
            <FormControl fullWidth>
              <InputLabel>Filter by Tags (optional)</InputLabel>
              <Select
                multiple
                value={filterTags}
                onChange={handleFilterTagsChange}
                label="Filter by Tags (optional)"
                sx={{ borderRadius: 2 }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availableFilterTags.map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    <Checkbox checked={filterTags.indexOf(tag) > -1} />
                    <ListItemText primary={tag} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Exercise Count or Selection */}
          {isRandomTest ? (
            <TextField
              label="Number of exercises"
              type="number"
              value={exerciseCount}
              onChange={(e) => setExerciseCount(Math.max(1, parseInt(e.target.value) || 1))}
              inputProps={{ min: 1, max: filteredExercises.length }}
              sx={{
                width: 200,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
              helperText={`Max: ${filteredExercises.length} exercises available`}
            />
          ) : (
            <FormControl fullWidth>
              <InputLabel>Select Exercises</InputLabel>
              <Select
                multiple
                value={selectedExerciseIds}
                onChange={handleExerciseSelection}
                label="Select Exercises"
                sx={{ borderRadius: 2 }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const exercise = exercises.find(ex => ex.id === id);
                      return (
                        <Chip key={id} label={exercise?.title || `Exercise ${id}`} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {filteredExercises.map((exercise) => (
                  <MenuItem key={exercise.id} value={exercise.id}>
                    <Checkbox checked={selectedExerciseIds.indexOf(exercise.id) > -1} />
                    <ListItemText
                      primary={exercise.title}
                      secondary={exercise.tags.join(', ')}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Test Tags */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
              Test Tags (optional)
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                onClick={handleAddTag}
                variant="contained"
                startIcon={<Add />}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Add
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 40 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(index)}
                  sx={{
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    '& .MuiChip-deleteIcon': {
                      color: 'primary.main',
                    },
                  }}
                />
              ))}
              {tags.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  No tags added yet
                </Typography>
              )}
            </Box>
          </Box>

          {/* Preview */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Test Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isRandomTest
                ? `Random test with ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`
                : `Custom test with ${selectedExerciseIds.length} selected exercise${selectedExerciseIds.length !== 1 ? 's' : ''}`
              }
              {filterTags.length > 0 && ` from exercises tagged: ${filterTags.join(', ')}`}
            </Typography>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleStartPracticeOnly}
          variant="outlined"
          color="secondary"
          disabled={!canCreate}
          startIcon={<PlayArrow />}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Practice Only
        </Button>
        <Button
          onClick={handleCreateAndStart}
          variant="contained"
          disabled={!canCreate || isCreating}
          startIcon={<Shuffle />}
          sx={{ borderRadius: 2, px: 3 }}
        >
          {isCreating ? 'Creating...' : 'Create & Start'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestCreationDialog;