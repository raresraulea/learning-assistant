import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  LinearProgress,
  Chip,
  Fade,
  Fab,
} from '@mui/material';
import {
  ArrowBack,
  Mic,
  MicOff,
  KeyboardVoice,
  Compare,
  NavigateNext,
  CheckCircle,
  School,
} from '@mui/icons-material';
import type { ExerciseModel } from '../types';

interface PracticeModeProps {
  exercises: ExerciseModel[];
  onExit: () => void;
}

interface SimilarityResult {
  score: number;
  matchedWords: string[];
  totalWords: number;
  suggestions: string[];
}

const PracticeMode: React.FC<PracticeModeProps> = ({ exercises, onExit }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [similarityResult, setSimilarityResult] = useState<SimilarityResult | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);
  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserInput(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const calculateSimilarity = (text1: string, text2: string): SimilarityResult => {
    const words1 = text1.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const words2 = text2.toLowerCase().split(/\s+/).filter(word => word.length > 0);

    const matchedWords: string[] = [];
    const totalWords = words2.length;

    words1.forEach(word => {
      if (words2.includes(word) && !matchedWords.includes(word)) {
        matchedWords.push(word);
      }
    });

    const score = totalWords > 0 ? (matchedWords.length / totalWords) * 100 : 0;

    const missingWords = words2.filter(word => !matchedWords.includes(word));
    const suggestions = missingWords.slice(0, 5);

    return {
      score: Math.round(score),
      matchedWords,
      totalWords,
      suggestions,
    };
  };

  const handleStartRecording = () => {
    if (recognitionRef.current && !isListening) {
      setIsRecording(true);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current && isListening) {
      setIsRecording(false);
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleCompare = () => {
    if (userInput.trim() && currentExercise) {
      const result = calculateSimilarity(userInput.trim(), currentExercise.content);
      setSimilarityResult(result);
      setShowComparison(true);

      if (result.score >= 70) {
        setCompletedExercises(prev => new Set([...prev, currentExerciseIndex]));
      }
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserInput('');
      setShowComparison(false);
      setSimilarityResult(null);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setShowComparison(false);
    setSimilarityResult(null);
  };

  const progress = ((completedExercises.size) / exercises.length) * 100;

  if (!currentExercise) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5">No exercises available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onExit}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <School sx={{ mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Practice Mode
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.2 }}>
              Exercise {currentExerciseIndex + 1} of {exercises.length} • {currentExercise.title}
            </Typography>
          </Box>
          <Chip
            label={`${completedExercises.size}/${exercises.length} completed`}
            color="secondary"
            sx={{ color: 'white', fontWeight: 600 }}
          />
        </Toolbar>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 4, backgroundColor: 'primary.dark' }}
        />
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', height: 'calc(100vh - 72px)' }}>
        {/* Left Side - Exercise */}
        <Box
          sx={{
            width: showComparison ? '50%' : '40%',
            backgroundColor: 'grey.50',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: 'width 0.3s ease',
          }}
        >
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', backgroundColor: 'white' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
              {currentExercise.title}
            </Typography>
            {currentExercise.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {currentExercise.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {currentExercise.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: 'primary.50',
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    height: 24
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!showComparison ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                  Exercise Content Hidden
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try to reproduce the content by typing or speaking.
                  <br />
                  Then compare your answer!
                </Typography>
              </Paper>
            ) : (
              <Paper
                sx={{
                  p: 3,
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  width: '100%',
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                  Original Content:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    fontSize: '1.1rem',
                    p: 2,
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                  }}
                >
                  {currentExercise.content}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Right Side - Input & Comparison */}
        <Box
          sx={{
            width: showComparison ? '50%' : '60%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease',
          }}
        >
          {/* Input Area */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Your Answer
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={isRecording ? 'contained' : 'outlined'}
                  color={isRecording ? 'error' : 'primary'}
                  startIcon={isRecording ? <MicOff /> : <Mic />}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  disabled={!recognitionRef.current}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { opacity: 1 },
                      '50%': { opacity: 0.7 },
                      '100%': { opacity: 1 },
                    },
                  }}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Clear
                </Button>
              </Box>
            </Box>

            <TextField
              multiline
              rows={10}
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer here or use speech recognition..."
              sx={{
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  backgroundColor: 'grey.50',
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  },
                },
                '& .MuiInputBase-input': {
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7,
                  },
                },
              }}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Compare />}
                onClick={handleCompare}
                disabled={!userInput.trim()}
                sx={{
                  borderRadius: 3,
                  px: 6,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0,123,255,0.4)',
                  },
                }}
              >
                Compare Answer
              </Button>
              {showComparison && currentExerciseIndex < exercises.length - 1 && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<NavigateNext />}
                  onClick={handleNextExercise}
                  sx={{
                    borderRadius: 3,
                    px: 6,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(255,149,0,0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(255,149,0,0.4)',
                    },
                  }}
                >
                  Next Exercise
                </Button>
              )}
            </Box>
          </Box>

          {/* Comparison Results */}
          {showComparison && similarityResult && (
            <Fade in={showComparison}>
              <Paper
                sx={{
                  m: 3,
                  mt: 0,
                  p: 3,
                  backgroundColor: 'background.paper',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: similarityResult.score >= 70 ? 'success.main' : 'warning.main',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <CheckCircle
                    color={similarityResult.score >= 70 ? 'success' : 'warning'}
                    sx={{ fontSize: 32 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Similarity Score: {similarityResult.score}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {similarityResult.score >= 70 ? 'Great job! Strong match.' : 'Good effort! Room for improvement.'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    Matched {similarityResult.matchedWords.length} of {similarityResult.totalWords} words
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={similarityResult.score}
                    color={similarityResult.score >= 70 ? 'success' : 'warning'}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>

                {similarityResult.suggestions.length > 0 && (
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                      Key words to include:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {similarityResult.suggestions.map((word, index) => (
                        <Chip
                          key={index}
                          label={word}
                          size="medium"
                          color="warning"
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            '&:hover': {
                              backgroundColor: 'warning.50',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </Fade>
          )}
        </Box>
      </Box>

      {/* Recording Indicator */}
      {isRecording && (
        <Fab
          color="error"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' },
              '100%': { transform: 'scale(1)' },
            },
          }}
        >
          <KeyboardVoice />
        </Fab>
      )}
    </Box>
  );
};

export default PracticeMode;