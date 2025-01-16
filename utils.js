export function handleError(res, error, statusCode = 400) {
  console.error('Error:', error);
  res.status(statusCode).json({
    success: false,
    error: error.message || 'An unexpected error occurred'
  });
}
