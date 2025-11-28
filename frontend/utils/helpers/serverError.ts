export const serverError = () => {
  return {
    code: 500,
    message: "An unexpected server error occurred. Server is not responding.",
    msg_code: "INTERNAL_SERVER_ERROR",
    error: {
      isError: true,
    },
    inputs: {
      email: "",
    },
  };
};
