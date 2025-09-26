import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Button,
  Box,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { Add, Description, School, CloudUpload } from '@mui/icons-material';
import ExerciseCard from './components/ExerciseCard';
import ExerciseForm from './components/ExerciseForm';
import PracticeMode from './components/PracticeMode';
import FileUploadDialog from './components/FileUploadDialog';
import TestCreationDialog from './components/TestCreationDialog';
import type { ExerciseModel, CreateExerciseDto, UpdateExerciseDto, CreateTestDto, TestModel } from './types';
import { exerciseService, testService } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007AFF',
      light: '#5AC8FA',
      dark: '#0051D5',
    },
    secondary: {
      main: '#FF9500',
    },
    background: {
      default: '#F2F2F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        },
      },
    },
  },
});

function App() {
  const [exercises, setExercises] = useState<ExerciseModel[]>([]);
  const [tests, setTests] = useState<TestModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [testCreationOpen, setTestCreationOpen] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  const [editingExercise, setEditingExercise] = useState<ExerciseModel | undefined>();
  const [selectedExercises, setSelectedExercises] = useState<ExerciseModel[]>([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const loadExercises = async () => {
    try {
      setLoading(true);
      const [exercisesData, testsData] = await Promise.all([
        exerciseService.getAllExercises(),
        testService.getAllTests()
      ]);
      setExercises(exercisesData);
      setTests(testsData);
    } catch (error) {
      console.error('Error loading data:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExercise = async (exerciseData: CreateExerciseDto) => {
    try {
      await exerciseService.createExercise(exerciseData);
      showSnackbar('Exercise created successfully');
      loadExercises();
    } catch (error) {
      console.error('Error creating exercise:', error);
      showSnackbar('Error creating exercise', 'error');
    }
  };

  const handleUploadExercises = async (exercises: CreateExerciseDto[]) => {
    try {
      for (const exercise of exercises) {
        await exerciseService.createExercise(exercise);
      }
      showSnackbar(`${exercises.length} exercise${exercises.length !== 1 ? 's' : ''} uploaded successfully`);
      loadExercises();
    } catch (error) {
      console.error('Error uploading exercises:', error);
      showSnackbar('Error uploading exercises', 'error');
      throw error; // Re-throw to let FileUploadDialog handle it
    }
  };

  const handleUpdateExercise = async (exerciseData: UpdateExerciseDto) => {
    if (!editingExercise) return;

    try {
      await exerciseService.updateExercise(editingExercise.id, exerciseData);
      showSnackbar('Exercise updated successfully');
      loadExercises();
    } catch (error) {
      console.error('Error updating exercise:', error);
      showSnackbar('Error updating exercise', 'error');
    }
  };

  const handleDeleteExercise = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;

    try {
      await exerciseService.deleteExercise(id);
      showSnackbar('Exercise deleted successfully');
      loadExercises();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      showSnackbar('Error deleting exercise', 'error');
    }
  };

  const handleEditExercise = (exercise: ExerciseModel) => {
    setEditingExercise(exercise);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingExercise(undefined);
  };

  const handleFormSubmit = (exerciseData: CreateExerciseDto | UpdateExerciseDto) => {
    if (editingExercise) {
      handleUpdateExercise(exerciseData as UpdateExerciseDto);
    } else {
      handleCreateExercise(exerciseData as CreateExerciseDto);
    }
  };

  const handleStartPractice = async () => {
    setTestCreationOpen(true);
  };

  const handleStartPracticeWithExercises = (practiceExercises: ExerciseModel[]) => {
    setSelectedExercises(practiceExercises);
    setPracticeMode(true);
  };

  const handleCreateTest = async (testData: CreateTestDto) => {
    try {
      await testService.createTest(testData);
      showSnackbar('Test created successfully');
      loadExercises(); // Reload to update test count
    } catch (error) {
      console.error('Error creating test:', error);
      showSnackbar('Error creating test', 'error');
      throw error; // Re-throw to let TestCreationDialog handle it
    }
  };

  const handleExitPractice = () => {
    setPracticeMode(false);
    setSelectedExercises([]);
  };

  useEffect(() => {
    loadExercises();
  }, []);

  if (practiceMode) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PracticeMode
          exercises={selectedExercises}
          onExit={handleExitPractice}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Full-width container */}
      <Box sx={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Description sx={{ color: 'primary.main' }} />
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',
                  fontWeight: 700,
                }}
              >
                Learning Assistant
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={() => setUploadOpen(true)}
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{
                  borderRadius: 20,
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Upload Files
              </Button>
              <Button
                onClick={handleStartPractice}
                variant="contained"
                color="secondary"
                startIcon={<School />}
                disabled={exercises.length === 0}
                sx={{
                  borderRadius: 20,
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Practice
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: 4, width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : exercises.length === 0 && tests.length === 0 ? (
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                backgroundColor: 'background.paper',
                borderRadius: 3,
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                No exercises yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Create your first exercise to start practicing and testing your knowledge.
              </Typography>
              <Button
                onClick={() => setFormOpen(true)}
                variant="contained"
                startIcon={<Add />}
                size="large"
                sx={{
                  borderRadius: 20,
                  px: 4,
                  py: 1.5,
                }}
              >
                Create Exercise
              </Button>
            </Paper>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Tabs
                  value={currentTab}
                  onChange={(_, newValue) => setCurrentTab(newValue)}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                    },
                  }}
                >
                  <Tab label={`Exercises (${exercises.length})`} />
                  <Tab label={`Tests (${tests.length})`} />
                </Tabs>
              </Box>

              {currentTab === 0 && (
                <Grid container spacing={3}>
                  {exercises.map((exercise) => (
                    <Grid key={exercise.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <ExerciseCard
                        exercise={exercise}
                        onEdit={handleEditExercise}
                        onDelete={handleDeleteExercise}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}

              {currentTab === 1 && (
                <Grid container spacing={3}>
                  {tests.map((test) => (
                    <Grid key={test.id} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Paper
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
                        <Box sx={{ p: 3, flex: 1 }}>
                          <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                              fontWeight: 600,
                              mb: 2,
                              color: 'text.primary',
                            }}
                          >
                            {test.name}
                          </Typography>

                          {test.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {test.description}
                            </Typography>
                          )}

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {test.exerciseCount} exercises
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {test.tags.slice(0, 3).map((tag, index) => (
                              <Box
                                key={index}
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  backgroundColor: 'secondary.50',
                                  color: 'secondary.main',
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                }}
                              >
                                {tag}
                              </Box>
                            ))}
                            {test.tags.length > 3 && (
                              <Box
                                sx={{
                                  px: 1,
                                  py: 0.5,
                                  border: 1,
                                  borderColor: 'secondary.main',
                                  color: 'secondary.main',
                                  borderRadius: 1,
                                  fontSize: '0.75rem',
                                  fontWeight: 500,
                                }}
                              >
                                +{test.tags.length - 3}
                              </Box>
                            )}
                          </Box>

                          <Typography variant="caption" color="text.secondary">
                            Created: {new Date(test.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, pt: 0 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={async () => {
                              try {
                                const testData = await testService.getTestById(test.id);
                                setSelectedExercises(testData.exercises);
                                setPracticeMode(true);
                              } catch (error) {
                                console.error('Error starting test:', error);
                                showSnackbar('Error starting test', 'error');
                              }
                            }}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              textTransform: 'none',
                            }}
                          >
                            Start Test
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}
        </Container>

        {currentTab === 0 && (
          <Fab
            onClick={() => setFormOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <Add />
          </Fab>
        )}

        {currentTab === 1 && exercises.length > 0 && (
          <Fab
            onClick={() => setTestCreationOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              backgroundColor: 'secondary.main',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
            }}
          >
            <Add />
          </Fab>
        )}

        <ExerciseForm
          open={formOpen}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          exercise={editingExercise}
          isEdit={!!editingExercise}
        />

        <FileUploadDialog
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onUpload={handleUploadExercises}
        />

        <TestCreationDialog
          open={testCreationOpen}
          onClose={() => setTestCreationOpen(false)}
          onCreateTest={handleCreateTest}
          onStartPractice={handleStartPracticeWithExercises}
          exercises={exercises}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;