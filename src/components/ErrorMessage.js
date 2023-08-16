const ErrorMessage = ({ message, onDismiss }) => {
  return (
    <p className="text-danger border border-danger rounded p-3 d-flex justify-content-between">
      {message}
      <span
        onClick={onDismiss}
        className="text-right"
        style={{ cursor: "pointer" }}
      >
        Dismiss
      </span>
    </p>
  );
};

export default ErrorMessage;
