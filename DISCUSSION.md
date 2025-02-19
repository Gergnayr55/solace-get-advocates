Didn't get to implement the UI functionality of handling page size changes and changing pages but was able to get the api returning offset based pagination with a default value to keep this around 2 hours.
- I would have liked to get the search functionality into its own component with URLSearchParams.
- Better error handling/using an ErrorBoundary component to handle runtime errors and a snackbar/toast for HTTP request errors.
- Cookie based authentication/jwt on requests like getAdvocates as it will contain sensitive data that would require authentication and proper permissions.
- Would add debounce to the search to handle not have oversaturating calls to the db and handle executing the api request when user has stoppeed typing for around ~3 seconds.